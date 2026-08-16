import ExpoModulesCore
import UIKit

struct InstagramStoryOptions: Record {
  @Field var appId: String = ""
  @Field var backgroundTopColor: String?
  @Field var backgroundBottomColor: String?
}

public class InstagramStoryShareModule: Module {
  public func definition() -> ModuleDefinition {
    Name("InstagramStoryShare")

    Function("isAvailable") { () -> Bool in
      guard let url = URL(string: "instagram-stories://share") else { return false }
      return UIApplication.shared.canOpenURL(url)
    }

    AsyncFunction("shareAsync") { (fileUri: String, options: InstagramStoryOptions) in
      let fileUrl = fileUri.hasPrefix("file://")
        ? URL(string: fileUri)
        : URL(fileURLWithPath: fileUri)

      guard let fileUrl, let data = try? Data(contentsOf: fileUrl) else {
        throw Exception(name: "ERR_INSTAGRAM_STORY", description: "Could not read \(fileUri)")
      }

      guard let url = URL(string: "instagram-stories://share?source_application=\(options.appId)"),
            UIApplication.shared.canOpenURL(url) else {
        throw Exception(name: "ERR_INSTAGRAM_STORY", description: "Instagram is not installed")
      }

      var item: [String: Any] = ["com.instagram.sharedSticker.stickerImage": data]
      if let top = options.backgroundTopColor {
        item["com.instagram.sharedSticker.backgroundTopColor"] = top
      }
      if let bottom = options.backgroundBottomColor {
        item["com.instagram.sharedSticker.backgroundBottomColor"] = bottom
      }

      DispatchQueue.main.async {
        UIPasteboard.general.setItems(
          [item],
          options: [.expirationDate: Date().addingTimeInterval(60 * 5)]
        )
        UIApplication.shared.open(url)
      }
    }
  }
}
