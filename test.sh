#!/bin/bash

# Create project directory structure
mkdir -p Kabala/Kabala/Resources/Assets.xcassets/AppIcon.appiconset
mkdir -p Kabala/Kabala/Resources/Preview\ Content
mkdir -p Kabala/Kabala/Screens/Authentication
mkdir -p Kabala/Kabala/Screens/Dashboard
mkdir -p Kabala/Kabala/Screens/Finances
mkdir -p Kabala/Kabala/Screens/Goals
mkdir -p Kabala/Kabala/Screens/Profile
mkdir -p Kabala/Kabala/Components
mkdir -p Kabala/Kabala/Models
mkdir -p Kabala/Kabala/Utilities

# Create project files
touch Kabala/Kabala.xcodeproj/project.pbxproj

# Create Swift files
cat > Kabala/Kabala/App/KabalaApp.swift << 'EOF'
import SwiftUI

@main
struct KabalaApp: App {
    @StateObject private var authManager = AuthManager()
    @StateObject private var financialData = FinancialDataManager()
    
    var body: some Scene {
        WindowGroup {
            Group {
                if authManager.isAuthenticated {
                    MainTabView()
                        .environmentObject(authManager)
                        .environmentObject(financialData)
                        .transition(.opacity)
                } else {
                    AuthenticationView()
                        .environmentObject(authManager)
                        .transition(.opacity)
                }
            }
            .animation(.easeInOut(duration: 0.3), value: authManager.isAuthenticated)
        }
    }
}
EOF

cat > Kabala/Kabala/Screens/Authentication/AuthManager.swift << 'EOF'
import Foundation

class AuthManager: ObservableObject {
    @Published var isAuthenticated = false
    @Published var isSignInMode = true
    @Published var email = ""
    @Published var password = ""
    @Published var confirmPassword = ""
    @Published var showError = false
    @Published var errorMessage = ""
    
    func authenticate() {
        guard !email.isEmpty, !password.isEmpty else {
            showError(message: "Please fill in all fields")
            return
        }
        
        if !isSignInMode && password != confirmPassword {
            showError(message: "Passwords don't match")
            return
        }
        
        isAuthenticated = true
    }
    
    private func showError(message: String) {
        errorMessage = message
        showError = true
    }
}
EOF

cat > Kabala/Kabala/Screens/Authentication/AuthenticationView.swift << 'EOF'
import SwiftUI

struct AuthenticationView: View {
    @EnvironmentObject var authManager: AuthManager
    @State private var logoScale: CGFloat = 0.8
    @State private var logoOpacity: Double = 0
    
    var body: some View {
        ZStack {
            Color("Background").ignoresSafeArea()
            
            VStack(spacing: 0) {
                VStack {
                    Image("kabala-logo")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 80, height: 80)
                        .scaleEffect(logoScale)
                        .opacity(logoOpacity)
                        .padding(.bottom, 8)
                    
                    Text(authManager.isSignInMode ? "Welcome Back" : "Create Account")
                        .font(.system(size: 28, weight: .bold, design: .rounded))
                        .foregroundColor(.white)
                    
                    Text("Track your financial goals with precision")
                        .font(.system(size: 16, weight: .medium))
                        .foregroundColor(Color("Gold").opacity(0.8))
                        .padding(.top, 4)
                }
                .padding(.bottom, 40)
                .onAppear {
                    withAnimation(.spring(response: 0.6, dampingFraction: 0.7)) {
                        logoScale = 1
                        logoOpacity = 1
                    }
                }
                
                VStack(spacing: 20) {
                    CustomTextField(placeholder: "Email", text: $authManager.email, icon: "envelope")
                    
                    CustomTextField(placeholder: "Password", text: $authManager.password, icon: "lock", isSecure: true)
                    
                    if !authManager.isSignInMode {
                        CustomTextField(placeholder: "Confirm Password", text: $authManager.confirmPassword, icon: "lock.fill", isSecure: true)
                    }
                    
                    if authManager.showError {
                        Text(authManager.errorMessage)
                            .font(.caption)
                            .foregroundColor(Color("Gold"))
                            .transition(.opacity)
                    }
                    
                    Button(action: {
                        authManager.authenticate()
                    }) {
                        HStack {
                            Text(authManager.isSignInMode ? "Sign In" : "Sign Up")
                                .font(.system(size: 18, weight: .semibold))
                            Image(systemName: "arrow.right")
                        }
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color("Teal"))
                        .foregroundColor(.white)
                        .cornerRadius(12)
                        .shadow(color: Color("Teal").opacity(0.3), radius: 10, x: 0, y: 5)
                    }
                    .padding(.top, 10)
                    
                    Button(action: {
                        withAnimation {
                            authManager.isSignInMode.toggle()
                            authManager.showError = false
                        }
                    }) {
                        Text(authManager.isSignInMode ? "Don't have an account? Sign Up" : "Already have an account? Sign In")
                            .font(.system(size: 14, weight: .medium))
                            .foregroundColor(Color("Gold"))
                    }
                    .padding(.top, 8)
                    
                    VStack(spacing: 16) {
                        Text("or continue with")
                            .font(.caption)
                            .foregroundColor(Color("LightGray"))
                        
                        HStack(spacing: 20) {
                            SocialLoginButton(icon: "applelogo")
                            SocialLoginButton(icon: "g.circle.fill")
                            SocialLoginButton(icon: "f.circle.fill")
                        }
                    }
                    .padding(.top, 30)
                }
                .padding(.horizontal, 30)
            }
        }
    }
}
EOF

cat > Kabala/Kabala/Components/CustomTextField.swift << 'EOF'
import SwiftUI

struct CustomTextField: View {
    var placeholder: String
    @Binding var text: String
    var icon: String
    var isSecure = false
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Image(systemName: icon)
                    .foregroundColor(Color("Gold"))
                    .frame(width: 20)
                
                if isSecure {
                    SecureField(placeholder, text: $text)
                } else {
                    TextField(placeholder, text: $text)
                }
            }
            .padding()
            .background(Color("DarkGray"))
            .cornerRadius(12)
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(Color("Gold").opacity(0.3), lineWidth: 1)
            )
            .foregroundColor(.white)
        }
    }
}
EOF

cat > Kabala/Kabala/Components/SocialLoginButton.swift << 'EOF'
import SwiftUI

struct SocialLoginButton: View {
    var icon: String
    
    var body: some View {
        Button(action: {}) {
            Image(systemName: icon)
                .font(.system(size: 24))
                .frame(width: 50, height: 50)
                .background(Color("DarkGray"))
                .foregroundColor(.white)
                .clipShape(Circle())
        }
        .buttonStyle(ScaleButtonStyle())
    }
}

struct ScaleButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed ? 0.9 : 1)
            .animation(.easeOut(duration: 0.2), value: configuration.isPressed)
    }
}
EOF

cat > Kabala/Kabala/Screens/MainTabView.swift << 'EOF'
import SwiftUI

struct MainTabView: View {
    @EnvironmentObject var authManager: AuthManager
    @EnvironmentObject var financialData: FinancialDataManager
    
    var body: some View {
        TabView {
            DashboardView()
                .tabItem {
                    Label("Dashboard", systemImage: "house.fill")
                }
            
            FinancesView()
                .tabItem {
                    Label("Finances", systemImage: "dollarsign.circle.fill")
                }
            
            GoalsView()
                .tabItem {
                    Label("Goals", systemImage: "flag.fill")
                }
            
            ProfileView()
                .tabItem {
                    Label("Profile", systemImage: "person.fill")
                }
        }
        .accentColor(Color("Teal"))
        .onAppear {
            let appearance = UITabBarAppearance()
            appearance.configureWithOpaqueBackground()
            appearance.backgroundColor = UIColor(named: "DarkGray")
            UITabBar.appearance().standardAppearance = appearance
            UITabBar.appearance().scrollEdgeAppearance = appearance
        }
    }
}
EOF

# Continue with other files...

# Create Assets.xcassets content
cat > Kabala/Kabala/Resources/Assets.xcassets/Contents.json << 'EOF'
{
  "info" : {
    "version" : 1,
    "author" : "xcode"
  }
}
EOF

# Create Color assets
mkdir -p Kabala/Kabala/Resources/Assets.xcassets/Background.colorset
mkdir -p Kabala/Kabala/Resources/Assets.xcassets/CardBackground.colorset
mkdir -p Kabala/Kabala/Resources/Assets.xcassets/DarkGray.colorset
mkdir -p Kabala/Kabala/Resources/Assets.xcassets/Gold.colorset
mkdir -p Kabala/Kabala/Resources/Assets.xcassets/Teal.colorset
mkdir -p Kabala/Kabala/Resources/Assets.xcassets/LightGray.colorset

cat > Kabala/Kabala/Resources/Assets.xcassets/Background.colorset/Contents.json << 'EOF'
{
  "colors" : [
    {
      "color" : {
        "color-space" : "srgb",
        "components" : {
          "alpha" : "1.000",
          "blue" : "0.059",
          "green" : "0.059",
          "red" : "0.059"
        }
      },
      "idiom" : "universal"
    }
  ],
  "info" : {
    "author" : "xcode",
    "version" : 1
  }
}
EOF

cat > Kabala/Kabala/Resources/Assets.xcassets/CardBackground.colorset/Contents.json << 'EOF'
{
  "colors" : [
    {
      "color" : {
        "color-space" : "srgb",
        "components" : {
          "alpha" : "1.000",
          "blue" : "0.118",
          "green" : "0.118",
          "red" : "0.118"
        }
      },
      "idiom" : "universal"
    }
  ],
  "info" : {
    "author" : "xcode",
    "version" : 1
  }
}
EOF

cat > Kabala/Kabala/Resources/Assets.xcassets/DarkGray.colorset/Contents.json << 'EOF'
{
  "colors" : [
    {
      "color" : {
        "color-space" : "srgb",
        "components" : {
          "alpha" : "1.000",
          "blue" : "0.200",
          "green" : "0.200",
          "red" : "0.200"
        }
      },
      "idiom" : "universal"
    }
  ],
  "info" : {
    "author" : "xcode",
    "version" : 1
  }
}
EOF

cat > Kabala/Kabala/Resources/Assets.xcassets/Gold.colorset/Contents.json << 'EOF'
{
  "colors" : [
    {
      "color" : {
        "color-space" : "srgb",
        "components" : {
          "alpha" : "1.000",
          "blue" : "0.588",
          "green" : "0.706",
          "red" : "0.831"
        }
      },
      "idiom" : "universal"
    }
  ],
  "info" : {
    "author" : "xcode",
    "version" : 1
  }
}
EOF

cat > Kabala/Kabala/Resources/Assets.xcassets/Teal.colorset/Contents.json << 'EOF'
{
  "colors" : [
    {
      "color" : {
        "color-space" : "srgb",
        "components" : {
          "alpha" : "1.000",
          "blue" : "0.800",
          "green" : "0.753",
          "red" : "0.376"
        }
      },
      "idiom" : "universal"
    }
  ],
  "info" : {
    "author" : "xcode",
    "version" : 1
  }
}
EOF

cat > Kabala/Kabala/Resources/Assets.xcassets/LightGray.colorset/Contents.json << 'EOF'
{
  "colors" : [
    {
      "color" : {
        "color-space" : "srgb",
        "components" : {
          "alpha" : "1.000",
          "blue" : "0.600",
          "green" : "0.600",
          "red" : "0.600"
        }
      },
      "idiom" : "universal"
    }
  ],
  "info" : {
    "author" : "xcode",
    "version" : 1
  }
}
EOF

# Create Preview Assets
cat > Kabala/Kabala/Resources/Preview\ Content/PreviewAssets.xcassets/Contents.json << 'EOF'
{
  "info" : {
    "version" : 1,
    "author" : "xcode"
  }
}
EOF

# Create Info.plist
cat > Kabala/Kabala/Resources/Info.plist << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleDevelopmentRegion</key>
    <string>$(DEVELOPMENT_LANGUAGE)</string>
    <key>CFBundleDisplayName</key>
    <string>Kabala</string>
    <key>CFBundleExecutable</key>
    <string>$(EXECUTABLE_NAME)</string>
    <key>CFBundleIdentifier</key>
    <string>$(PRODUCT_BUNDLE_IDENTIFIER)</string>
    <key>CFBundleInfoDictionaryVersion</key>
    <string>6.0</string>
    <key>CFBundleName</key>
    <string>$(PRODUCT_NAME)</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0</string>
    <key>CFBundleVersion</key>
    <string>1</string>
    <key>LSRequiresIPhoneOS</key>
    <true/>
    <key>UIApplicationSceneManifest</key>
    <dict>
        <key>UIApplicationSupportsMultipleScenes</key>
        <false/>
        <key>UISceneConfigurations</key>
        <dict>
            <key>UIWindowSceneSessionRoleApplication</key>
            <array>
                <dict>
                    <key>UISceneConfigurationName</key>
                    <string>Default Configuration</string>
                    <key>UISceneDelegateClassName</key>
                    <string>$(PRODUCT_MODULE_NAME).SceneDelegate</string>
                </dict>
            </array>
        </dict>
    </dict>
    <key>UIAppFonts</key>
    <array>
        <string>SF-Pro-Display-Bold.otf</string>
        <string>SF-Pro-Display-Medium.otf</string>
        <string>SF-Pro-Display-Regular.otf</string>
    </array>
    <key>UILaunchStoryboardName</key>
    <string>LaunchScreen</string>
    <key>UIRequiredDeviceCapabilities</key>
    <array>
        <string>arm64</string>
    </array>
    <key>UISupportedInterfaceOrientations</key>
    <array>
        <string>UIInterfaceOrientationPortrait</string>
    </array>
    <key>UISupportedInterfaceOrientations~ipad</key>
    <array>
        <string>UIInterfaceOrientationPortrait</string>
        <string>UIInterfaceOrientationPortraitUpsideDown</string>
    </array>
</dict>
</plist>
EOF

echo "Kabala Financial Goals App project structure created successfully!"
