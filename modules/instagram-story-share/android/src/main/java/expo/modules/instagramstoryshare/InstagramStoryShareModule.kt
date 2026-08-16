package expo.modules.instagramstoryshare

import android.content.Intent
import android.net.Uri
import androidx.core.content.FileProvider
import expo.modules.kotlin.exception.CodedException
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import java.io.File

private const val INSTAGRAM_PACKAGE = "com.instagram.android"
private const val ADD_TO_STORY = "com.instagram.share.ADD_TO_STORY"

class InstagramStoryOptions : Record {
  @Field val appId: String = ""

  @Field val backgroundTopColor: String? = null

  @Field val backgroundBottomColor: String? = null
}

class InstagramStoryShareException(message: String) :
  CodedException("ERR_INSTAGRAM_STORY", message, null)

class InstagramStoryShareModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("InstagramStoryShare")

    Function("isAvailable") {
      val context = appContext.reactContext ?: return@Function false
      val intent = Intent(ADD_TO_STORY).setPackage(INSTAGRAM_PACKAGE)
      intent.resolveActivity(context.packageManager) != null
    }

    AsyncFunction("shareAsync") { fileUri: String, options: InstagramStoryOptions ->
      val activity = appContext.currentActivity
        ?: throw InstagramStoryShareException("No activity to share from")

      val path = Uri.parse(fileUri).path
        ?: throw InstagramStoryShareException("Invalid file uri: $fileUri")
      val file = File(path)
      if (!file.exists()) {
        throw InstagramStoryShareException("File does not exist: $path")
      }

      val contentUri = FileProvider.getUriForFile(
        activity,
        "${activity.packageName}.instagramstoryshare.fileprovider",
        file
      )

      val intent = Intent(ADD_TO_STORY).apply {
        setPackage(INSTAGRAM_PACKAGE)
        type = "image/png"
        putExtra("source_application", options.appId)
        putExtra("interactive_asset_uri", contentUri)
        options.backgroundTopColor?.let { putExtra("top_background_color", it) }
        options.backgroundBottomColor?.let { putExtra("bottom_background_color", it) }
        addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
      }

      if (intent.resolveActivity(activity.packageManager) == null) {
        throw InstagramStoryShareException("Instagram is not installed")
      }

      activity.grantUriPermission(
        INSTAGRAM_PACKAGE,
        contentUri,
        Intent.FLAG_GRANT_READ_URI_PERMISSION
      )
      activity.startActivity(intent)
    }
  }
}
