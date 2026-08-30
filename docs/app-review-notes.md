# App Review Notes

Answers for the Guideline 2.1 information request. Paste the whole block into the
Resolution Center reply and into **App Review Information > Notes** for every
future submission.

Fill in the demo credentials before sending. They are deliberately not stored
here: this repository is public.

---

**1. Screen recording**

Attached. Recorded on a physical iPhone 13 running iOS 26.6.

**2. Devices and operating systems tested**

- iPhone 13, iOS 26.6 (physical device, build distributed via TestFlight)

**3. What the app does and who it is for**

NatareApp is a training companion for competitive swimming teams. Coaches build
workouts on our web platform (https://natare.app) and the athletes of their team
receive those workouts on the app.

Target audience: swimmers enrolled in a swimming team, and their coaches.

Problem it solves: swimming workouts are still handed out on paper, spreadsheets
or group chats, where they get lost and no history is kept. The app gives each
athlete the workout of the day with every set, distance and rest interval, keeps
the history of what was completed, and shows the coach who trained.

The app is free, has no subscriptions, no in-app purchases and no advertising.

**4. How to access the main features**

The app is invite-only: an athlete is registered by their coach, so there is no
public sign-up screen. Please use this demo account, which already has workouts:

- Email: `<demo email>`
- Password: `<demo password>`

Flow after logging in:

1. Home: next workout, current streak and activity heatmap.
2. Tap the workout card to see the full session (sections, series, distances,
   strokes and rest intervals) and mark it as completed.
3. Workouts tab: browse the team's workouts week by week.
4. Share button on a completed workout: builds a summary card and opens the
   system share sheet (Instagram Stories, if installed).
5. Profile tab: personal data (birth date, sex, height, weight) and profile
   photo, which requests photo library access.
6. Profile > Excluir conta (Delete account): full in-app account deletion flow,
   with confirmation. It permanently deletes the account and its data.

There are no paid features, no user-to-user content feed and no user-generated
content shared publicly, so no reporting or blocking mechanism applies.

**5. External services used**

- Our own backend API (Laravel), at https://api.natare.app, which stores all
  accounts, teams and workouts
- Expo Push Notification Service (Expo, expo.dev): delivery of push
  notifications about new workouts and invitations
- Cloudinary: storage and delivery of profile photos
- Resend: transactional email (invitations and password reset)

No authentication provider from a third party, no payment processor, no
advertising SDK, no analytics SDK and no AI service are used.

**6. Regional differences**

None. The app behaves identically in every region. The interface is available in
Brazilian Portuguese only, and the content is created by each team's own coach.

**7. Regulated industry or protected third-party material**

Not applicable. The app is not part of a regulated industry and contains no
third-party protected material. All content shown is created by the coaches of
each team, inside the platform.

---

## Screen recording script

Record on the iPhone 13 with the TestFlight build, in one take, around 2 minutes:

1. Start on the home screen of iOS and launch the app (the recording must begin
   with the launch).
2. Log in with the demo account, typing the credentials on screen.
3. Home: show the next workout card, the streak and the heatmap.
4. Open the workout, scroll through the sections and series, mark it completed.
5. Workouts tab: navigate between weeks.
6. Open a completed workout and use the share button, showing the summary card
   and the share sheet.
7. Profile: open it, tap the avatar and show the **photo library permission
   prompt** (this one matters, they asked for the sensitive-data prompts).
8. Notification permission: the prompt is triggered right after login by
   `NotificationsProvider`, so it is usually already captured in step 2. Only
   the system dialog needs to appear on screen; there is no need to receive an
   actual push notification.
9. Profile > Excluir conta: walk through the deletion flow up to the
   confirmation screen. Use a throwaway account if you do not want to lose the
   demo one, or cancel at the last step and say so in the reply.
