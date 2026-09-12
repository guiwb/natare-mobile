const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const appJsonPath = path.join(root, 'app.json');
const packageJsonPath = path.join(root, 'package.json');
const packageLockPath = path.join(root, 'package-lock.json');

const MINOR_TYPES = /^feat(\([^)]*\))?:/;
const PATCH_TYPES = /^(fix|perf|refactor|revert)(\([^)]*\))?:/;
const BREAKING = /^[a-z]+(\([^)]*\))?!:/;

function git(...args) {
  return execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
}

function readVersions() {
  const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const packageLock = JSON.parse(fs.readFileSync(packageLockPath, 'utf8'));
  return {
    app: appJson.expo.version,
    pkg: packageJson.version,
    lock: packageLock.version,
  };
}

function assertInSync() {
  const { app, pkg, lock } = readVersions();
  if (app !== pkg || app !== lock) {
    throw new Error(
      `version mismatch: app.json ${app}, package.json ${pkg}, package-lock.json ${lock}`,
    );
  }
  return app;
}

function lastTag() {
  try {
    return git('describe', '--tags', '--abbrev=0', '--match', 'v[0-9]*');
  } catch {
    return null;
  }
}

function commitsSince(tag) {
  const range = tag ? `${tag}..HEAD` : 'HEAD';
  const log = git('log', range, '--no-merges', '--format=%B%x00');
  return log
    .split('\0')
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function bumpLevel(commits) {
  let level = null;
  for (const commit of commits) {
    const [subject, ...rest] = commit.split('\n');
    const body = rest.join('\n');
    if (BREAKING.test(subject) || /^BREAKING[ -]CHANGE:/m.test(body))
      return 'major';
    if (MINOR_TYPES.test(subject)) level = 'minor';
    else if (PATCH_TYPES.test(subject) && level !== 'minor') level = 'patch';
  }
  return level;
}

function nextVersion(current, level) {
  const [major, minor, patch] = current.split('.').map(Number);
  if (level === 'major') return `${major + 1}.0.0`;
  if (level === 'minor') return `${major}.${minor + 1}.0`;
  return `${major}.${minor}.${patch + 1}`;
}

function write(version) {
  const appJson = fs.readFileSync(appJsonPath, 'utf8');
  fs.writeFileSync(
    appJsonPath,
    appJson.replace(/("version":\s*)"[^"]+"/, `$1"${version}"`),
  );
  execFileSync(
    'npm',
    ['version', version, '--no-git-tag-version', '--allow-same-version'],
    {
      cwd: root,
      stdio: 'ignore',
    },
  );
}

function emit(key, value) {
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `${key}=${value}\n`);
  }
  console.log(`${key}=${value}`);
}

const current = assertInSync();

if (process.argv.includes('--check')) {
  console.log(`versions in sync at ${current}`);
  process.exit(0);
}

const tag = lastTag();

if (!tag) {
  emit('version', '');
  emit('tag', `v${current}`);
  console.log(`no release tag found, tagging the current version ${current}`);
  process.exit(0);
}

const level = bumpLevel(commitsSince(tag));

if (!level) {
  emit('version', '');
  emit('tag', '');
  console.log(`no releasable commit since ${tag}`);
  process.exit(0);
}

const version = nextVersion(current, level);
write(version);
emit('version', version);
emit('tag', `v${version}`);
console.log(`${level} bump since ${tag}: ${current} -> ${version}`);
