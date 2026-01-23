#!/usr/bin/env bash

# ==============================================================================
# Script to Create a Complete, Runnable Kabala Xcode Project
# ==============================================================================
# Creates the .xcodeproj, source files, asset catalog structure, and Info.plist.
# Run this script in an empty directory.
# Limitations:
# - Relies on an embedded project.pbxproj template (may break with Xcode updates).
# - Code signing (Development Team) must still be set manually in Xcode for device builds.
# ==============================================================================

# --- Configuration ---
PROJECT_NAME="Kabala"
BUNDLE_ID_BASE="today.youlove" # Change if desired
TARGET_IOS_VERSION="16.0"

# --- Safety Check ---
if [ "$(ls -A .)" ]; then
 echo "❌ Error: This script must be run in an empty directory."
 exit 1
fi

echo "🚀 Starting Kabala project generation..."

# --- Create Project Root Directory ---
mkdir "$PROJECT_NAME"
cd "$PROJECT_NAME" || exit 1 # Exit if cd fails
echo "   Created project directory: $PROJECT_NAME"

# --- Create .xcodeproj Package ---
echo "   Creating $PROJECT_NAME.xcodeproj structure..."
mkdir "$PROJECT_NAME.xcodeproj"

# --- Create project.pbxproj (Embedded Template) ---
# IMPORTANT: This is a minimal template. Complex changes require regenerating it.
# Based on Xcode 15/16, iOS App, SwiftUI, Swift.
cat << 'EOF' > "$PROJECT_NAME.xcodeproj/project.pbxproj"
// !$*UTF8*$!
{
	archiveVersion = 1;
	classes = {
	};
	objectVersion = 56;
	objects = {

/* Begin PBXBuildFile section */
		04C1C9BD2C3A6E9100E0A7F7 /* KabalaApp.swift in Sources */ = {isa = PBXBuildFile; fileRef = 04C1C9BC2C3A6E9100E0A7F7 /* KabalaApp.swift */; };
		04C1C9BF2C3A6E9100E0A7F7 /* Assets.xcassets in Resources */ = {isa = PBXBuildFile; fileRef = 04C1C9BE2C3A6E9100E0A7F7 /* Assets.xcassets */; };
		04C1C9C12C3A6E9100E0A7F7 /* Preview Assets.xcassets in Resources */ = {isa = PBXBuildFile; fileRef = 04C1C9C02C3A6E9100E0A7F7 /* Preview Assets.xcassets */; };
		5F0064D02C403D9A003439C4 /* ContentView.swift in Sources */ = {isa = PBXBuildFile; fileRef = 5F0064CF2C403D9A003439C4 /* ContentView.swift */; };
		5F0064D22C403DA5003439C4 /* UserDataManager.swift in Sources */ = {isa = PBXBuildFile; fileRef = 5F0064D12C403DA5003439C4 /* UserDataManager.swift */; };
		5F0064D42C403DAA003439C4 /* FinancialMetrics.swift in Sources */ = {isa = PBXBuildFile; fileRef = 5F0064D32C403DAA003439C4 /* FinancialMetrics.swift */; };
		5F0064D62C403DAC003439C4 /* Goal.swift in Sources */ = {isa = PBXBuildFile; fileRef = 5F0064D52C403DAC003439C4 /* Goal.swift */; };
		5F0064D82C403DB0003439C4 /* Colors.swift in Sources */ = {isa = PBXBuildFile; fileRef = 5F0064D72C403DB0003439C4 /* Colors.swift */; };
		5F0064DA2C403DB4003439C4 /* Fonts.swift in Sources */ = {isa = PBXBuildFile; fileRef = 5F0064D92C403DB4003439C4 /* Fonts.swift */; };
		5F0064DC2C403DB8003439C4 /* Formatters.swift in Sources */ = {isa = PBXBuildFile; fileRef = 5F0064DB2C403DB8003439C4 /* Formatters.swift */; };
		5F0064DE2C403DC1003439C4 /* AuthContainerView.swift in Sources */ = {isa = PBXBuildFile; fileRef = 5F0064DD2C403DC1003439C4 /* AuthContainerView.swift */; };
		5F0064E02C403DC7003439C4 /* CircularProgressView.swift in Sources */ = {isa = PBXBuildFile; fileRef = 5F0064DF2C403DC7003439C4 /* CircularProgressView.swift */; };
		5F0064E22C403DCD003439C4 /* DashboardView.swift in Sources */ = {isa = PBXBuildFile; fileRef = 5F0064E12C403DCD003439C4 /* DashboardView.swift */; };
		5F0064E42C403DD3003439C4 /* FinancesView.swift in Sources */ = {isa = PBXBuildFile; fileRef = 5F0064E32C403DD3003439C4 /* FinancesView.swift */; };
		5F0064E62C403DD7003439C4 /* MainTabView.swift in Sources */ = {isa = PBXBuildFile; fileRef = 5F0064E52C403DD7003439C4 /* MainTabView.swift */; };
/* End PBXBuildFile section */

/* Begin PBXFileReference section */
		04C1C9B92C3A6E9100E0A7F7 /* Kabala.app */ = {isa = PBXFileReference; explicitFileType = wrapper.application; includeInIndex = 0; path = Kabala.app; sourceTree = BUILT_PRODUCTS_DIR; };
		04C1C9BC2C3A6E9100E0A7F7 /* KabalaApp.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = KabalaApp.swift; sourceTree = "<group>"; };
		04C1C9BE2C3A6E9100E0A7F7 /* Assets.xcassets */ = {isa = PBXFileReference; lastKnownFileType = folder.assetcatalog; path = Assets.xcassets; sourceTree = "<group>"; };
		04C1C9C02C3A6E9100E0A7F7 /* Preview Assets.xcassets */ = {isa = PBXFileReference; lastKnownFileType = folder.assetcatalog; path = "Preview Assets.xcassets"; sourceTree = "<group>"; };
		04C1C9C32C3A6E9100E0A7F7 /* Info.plist */ = {isa = PBXFileReference; lastKnownFileType = text.plist.xml; path = Info.plist; sourceTree = "<group>"; };
		5F0064CE2C403D99003439C4 /* Kabala */ = {isa = PBXFileReference; lastKnownFileType = folder; name = Kabala; path = ../Kabala; sourceTree = "<group>"; };
		5F0064CF2C403D9A003439C4 /* ContentView.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = ContentView.swift; sourceTree = "<group>"; };
		5F0064D12C403DA5003439C4 /* UserDataManager.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = UserDataManager.swift; sourceTree = "<group>"; };
		5F0064D32C403DAA003439C4 /* FinancialMetrics.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = FinancialMetrics.swift; sourceTree = "<group>"; };
		5F0064D52C403DAC003439C4 /* Goal.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = Goal.swift; sourceTree = "<group>"; };
		5F0064D72C403DB0003439C4 /* Colors.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = Colors.swift; sourceTree = "<group>"; };
		5F0064D92C403DB4003439C4 /* Fonts.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = Fonts.swift; sourceTree = "<group>"; };
		5F0064DB2C403DB8003439C4 /* Formatters.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = Formatters.swift; sourceTree = "<group>"; };
		5F0064DD2C403DC1003439C4 /* AuthContainerView.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = AuthContainerView.swift; sourceTree = "<group>"; };
		5F0064DF2C403DC7003439C4 /* CircularProgressView.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = CircularProgressView.swift; sourceTree = "<group>"; };
		5F0064E12C403DCD003439C4 /* DashboardView.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = DashboardView.swift; sourceTree = "<group>"; };
		5F0064E32C403DD3003439C4 /* FinancesView.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = FinancesView.swift; sourceTree = "<group>"; };
		5F0064E52C403DD7003439C4 /* MainTabView.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = MainTabView.swift; sourceTree = "<group>"; };
		5F0064E72C403DF5003439C4 /* Models */ = {isa = PBXFileReference; lastKnownFileType = folder; name = Models; path = Models; sourceTree = "<group>"; };
		5F0064E82C403DF8003439C4 /* Data */ = {isa = PBXFileReference; lastKnownFileType = folder; name = Data; path = Data; sourceTree = "<group>"; };
		5F0064E92C403DFB003439C4 /* Utils */ = {isa = PBXFileReference; lastKnownFileType = folder; name = Utils; path = Utils; sourceTree = "<group>"; };
		5F0064EA2C403DFE003439C4 /* Views */ = {isa = PBXFileReference; lastKnownFileType = folder; name = Views; path = Views; sourceTree = "<group>"; };
		5F0064EB2C403E01003439C4 /* Authentication */ = {isa = PBXFileReference; lastKnownFileType = folder; name = Authentication; path = Authentication; sourceTree = "<group>"; };
		5F0064EC2C403E03003439C4 /* Dashboard */ = {isa = PBXFileReference; lastKnownFileType = folder; name = Dashboard; path = Dashboard; sourceTree = "<group>"; };
		5F0064ED2C403E05003439C4 /* Finances */ = {isa = PBXFileReference; lastKnownFileType = folder; name = Finances; path = Finances; sourceTree = "<group>"; };
		5F0064EE2C403E07003439C4 /* Common */ = {isa = PBXFileReference; lastKnownFileType = folder; name = Common; path = Common; sourceTree = "<group>"; };
		5F0064EF2C403E0B003439C4 /* Preview Content */ = {isa = PBXFileReference; lastKnownFileType = folder; name = "Preview Content"; path = "Preview Content"; sourceTree = "<group>"; };
/* End PBXFileReference section */

/* Begin PBXGroup section */
		04C1C9B32C3A6E9100E0A7F7 = {
			isa = PBXGroup;
			children = (
				5F0064CE2C403D99003439C4 /* Kabala */,
				04C1C9BA2C3A6E9100E0A7F7 /* Products */,
			);
			sourceTree = "<group>";
		};
		04C1C9BA2C3A6E9100E0A7F7 /* Products */ = {
			isa = PBXGroup;
			children = (
				04C1C9B92C3A6E9100E0A7F7 /* Kabala.app */,
			);
			name = Products;
			sourceTree = "<group>";
		};
		5F0064CE2C403D99003439C4 /* Kabala */ = {
			isa = PBXGroup;
			children = (
				04C1C9BC2C3A6E9100E0A7F7 /* KabalaApp.swift */,
				5F0064E82C403DF8003439C4 /* Data */,
				5F0064E72C403DF5003439C4 /* Models */,
				5F0064E92C403DFB003439C4 /* Utils */,
				5F0064EA2C403DFE003439C4 /* Views */,
				04C1C9BE2C3A6E9100E0A7F7 /* Assets.xcassets */,
				5F0064EF2C403E0B003439C4 /* Preview Content */,
				04C1C9C32C3A6E9100E0A7F7 /* Info.plist */,
			);
			path = Kabala;
			sourceTree = "<group>";
		};
		5F0064E72C403DF5003439C4 /* Models */ = {
			isa = PBXGroup;
			children = (
				5F0064D32C403DAA003439C4 /* FinancialMetrics.swift */,
				5F0064D52C403DAC003439C4 /* Goal.swift */,
			);
			path = Models;
			sourceTree = "<group>";
		};
		5F0064E82C403DF8003439C4 /* Data */ = {
			isa = PBXGroup;
			children = (
				5F0064D12C403DA5003439C4 /* UserDataManager.swift */,
			);
			path = Data;
			sourceTree = "<group>";
		};
		5F0064E92C403DFB003439C4 /* Utils */ = {
			isa = PBXGroup;
			children = (
				5F0064D72C403DB0003439C4 /* Colors.swift */,
				5F0064D92C403DB4003439C4 /* Fonts.swift */,
				5F0064DB2C403DB8003439C4 /* Formatters.swift */,
			);
			path = Utils;
			sourceTree = "<group>";
		};
		5F0064EA2C403DFE003439C4 /* Views */ = {
			isa = PBXGroup;
			children = (
				5F0064CF2C403D9A003439C4 /* ContentView.swift */,
				5F0064EB2C403E01003439C4 /* Authentication */,
				5F0064EC2C403E03003439C4 /* Dashboard */,
				5F0064ED2C403E05003439C4 /* Finances */,
				5F0064EE2C403E07003439C4 /* Common */,
				5F0064E52C403DD7003439C4 /* MainTabView.swift */,
			);
			path = Views;
			sourceTree = "<group>";
		};
		5F0064EB2C403E01003439C4 /* Authentication */ = {
			isa = PBXGroup;
			children = (
				5F0064DD2C403DC1003439C4 /* AuthContainerView.swift */,
			);
			path = Authentication;
			sourceTree = "<group>";
		};
		5F0064EC2C403E03003439C4 /* Dashboard */ = {
			isa = PBXGroup;
			children = (
				5F0064E12C403DCD003439C4 /* DashboardView.swift */,
			);
			path = Dashboard;
			sourceTree = "<group>";
		};
		5F0064ED2C403E05003439C4 /* Finances */ = {
			isa = PBXGroup;
			children = (
				5F0064E32C403DD3003439C4 /* FinancesView.swift */,
			);
			path = Finances;
			sourceTree = "<group>";
		};
		5F0064EE2C403E07003439C4 /* Common */ = {
			isa = PBXGroup;
			children = (
				5F0064DF2C403DC7003439C4 /* CircularProgressView.swift */,
			);
			path = Common;
			sourceTree = "<group>";
		};
		5F0064EF2C403E0B003439C4 /* Preview Content */ = {
			isa = PBXGroup;
			children = (
				04C1C9C02C3A6E9100E0A7F7 /* Preview Assets.xcassets */,
			);
			path = "Preview Content";
			sourceTree = "<group>";
		};
/* End PBXGroup section */

/* Begin PBXNativeTarget section */
		04C1C9B82C3A6E9100E0A7F7 /* Kabala */ = {
			isa = PBXNativeTarget;
			buildConfigurationList = 04C1C9C62C3A6E9100E0A7F7 /* Build configuration list for PBXNativeTarget "Kabala" */;
			buildPhases = (
				04C1C9B52C3A6E9100E0A7F7 /* Sources */,
				04C1C9B62C3A6E9100E0A7F7 /* Frameworks */,
				04C1C9B72C3A6E9100E0A7F7 /* Resources */,
			);
			buildRules = (
			);
			dependencies = (
			);
			name = Kabala;
			packageProductDependencies = (
			);
			productName = Kabala;
			productReference = 04C1C9B92C3A6E9100E0A7F7 /* Kabala.app */;
			productType = "com.apple.product-type.application";
		};
/* End PBXNativeTarget section */

/* Begin PBXProject section */
		04C1C9B42C3A6E9100E0A7F7 /* Project object */ = {
			isa = PBXProject;
			attributes = {
				BuildIndependentTargetsInParallel = 1;
				LastSwiftUpdateCheck = 1520;
				LastUpgradeCheck = 1520;
				TargetAttributes = {
					04C1C9B82C3A6E9100E0A7F7 = {
						CreatedOnToolsVersion = 15.2;
						DevelopmentTeam = ""; // <<< YOU MUST SET THIS IN XCODE FOR DEVICE BUILDS
						ProvisioningStyle = Automatic;
					};
				};
			};
			buildConfigurationList = 04C1C9B12C3A6E9100E0A7F7 /* Build configuration list for PBXProject "Kabala" */;
			compatibilityVersion = "Xcode 14.0";
			developmentRegion = en;
			hasScannedForEncodings = 0;
			knownRegions = (
				en,
				Base,
			);
			mainGroup = 04C1C9B32C3A6E9100E0A7F7;
			productRefGroup = 04C1C9BA2C3A6E9100E0A7F7 /* Products */;
			projectDirPath = "";
			projectRoot = "";
			targets = (
				04C1C9B82C3A6E9100E0A7F7 /* Kabala */,
			);
		};
/* End PBXProject section */

/* Begin PBXResourcesBuildPhase section */
		04C1C9B72C3A6E9100E0A7F7 /* Resources */ = {
			isa = PBXResourcesBuildPhase;
			buildActionMask = 2147483647;
			files = (
				04C1C9BF2C3A6E9100E0A7F7 /* Assets.xcassets in Resources */,
				04C1C9C12C3A6E9100E0A7F7 /* Preview Assets.xcassets in Resources */,
			);
			runOnlyForDeploymentPostprocessing = 0;
		};
/* End PBXResourcesBuildPhase section */

/* Begin PBXSourcesBuildPhase section */
		04C1C9B52C3A6E9100E0A7F7 /* Sources */ = {
			isa = PBXSourcesBuildPhase;
			buildActionMask = 2147483647;
			files = (
				5F0064D82C403DB0003439C4 /* Colors.swift in Sources */,
				5F0064E42C403DD3003439C4 /* FinancesView.swift in Sources */,
				5F0064D22C403DA5003439C4 /* UserDataManager.swift in Sources */,
				5F0064D62C403DAC003439C4 /* Goal.swift in Sources */,
				5F0064E02C403DC7003439C4 /* CircularProgressView.swift in Sources */,
				5F0064DC2C403DB8003439C4 /* Formatters.swift in Sources */,
				5F0064E22C403DCD003439C4 /* DashboardView.swift in Sources */,
				5F0064D02C403D9A003439C4 /* ContentView.swift in Sources */,
				5F0064DA2C403DB4003439C4 /* Fonts.swift in Sources */,
				5F0064E62C403DD7003439C4 /* MainTabView.swift in Sources */,
				04C1C9BD2C3A6E9100E0A7F7 /* KabalaApp.swift in Sources */,
				5F0064DE2C403DC1003439C4 /* AuthContainerView.swift in Sources */,
				5F0064D42C403DAA003439C4 /* FinancialMetrics.swift in Sources */,
			);
			runOnlyForDeploymentPostprocessing = 0;
		};
/* End PBXSourcesBuildPhase section */

/* Begin PBXVariantGroup section */
/* End PBXVariantGroup section */

/* Begin XCBuildConfiguration section */
		04C1C9C42C3A6E9100E0A7F7 /* Debug */ = {
			isa = XCBuildConfiguration;
			buildSettings = {
				ACCELERATE_ในการใช้งาน_PREFER_SWIFT = YES;
				ALWAYS_SEARCH_USER_PATHS = NO;
				ASSETCATALOG_COMPILER_APPICON_NAME = AppIcon;
				ASSETCATALOG_COMPILER_DEVELOPMENT_LANGUAGE = en;
				ASSETCATALOG_COMPILER_GLOBAL_ACCENT_COLOR_NAME = AccentColor;
				CLANG_ANALYZER_NONNULL = YES;
				CLANG_ANALYZER_NUMBER_OBJECT_CONVERSION = YES_AGGRESSIVE;
				CLANG_CXX_LANGUAGE_STANDARD = "gnu++20";
				CLANG_ENABLE_MODULES = YES;
				CLANG_ENABLE_OBJC_ARC = YES;
				CLANG_ENABLE_OBJC_WEAK = YES;
				CLANG_WARN_BLOCK_CAPTURE_AUTORELEASING = YES;
				CLANG_WARN_BOOL_CONVERSION = YES;
				CLANG_WARN_COMMA = YES;
				CLANG_WARN_CONSTANT_CONVERSION = YES;
				CLANG_WARN_DEPRECATED_OBJC_IMPLEMENTATIONS = YES;
				CLANG_WARN_DIRECT_OBJC_ISA_USAGE = YES_ERROR;
				CLANG_WARN_DOCUMENTATION_COMMENTS = YES;
				CLANG_WARN_EMPTY_BODY = YES;
				CLANG_WARN_ENUM_CONVERSION = YES;
				CLANG_WARN_INFINITE_RECURSION = YES;
				CLANG_WARN_INT_CONVERSION = YES;
				CLANG_WARN_NON_LITERAL_NULL_CONVERSION = YES;
				CLANG_WARN_OBJC_IMPLICIT_RETAIN_SELF = YES;
				CLANG_WARN_OBJC_LITERAL_CONVERSION = YES;
				CLANG_WARN_OBJC_ROOT_CLASS = YES_ERROR;
				CLANG_WARN_QUOTED_INCLUDE_IN_FRAMEWORK_HEADER = YES;
				CLANG_WARN_RANGE_LOOP_ANALYSIS = YES;
				CLANG_WARN_STRICT_PROTOTYPES = YES;
				CLANG_WARN_SUSPICIOUS_MOVE = YES;
				CLANG_WARN_UNGUARDED_AVAILABILITY = YES_AGGRESSIVE;
				CLANG_WARN_UNREACHABLE_CODE = YES;
				CLANG_WARN__DUPLICATE_METHOD_MATCH = YES;
				CODE_SIGN_IDENTITY = "Apple Development";
				COPY_PHASE_STRIP = NO;
				CREATE_INFOPLIST_SECTION_IN_BINARY = NO;
				DEBUG_INFORMATION_FORMAT = dwarf;
				ENABLE_PREVIEWS = YES;
				ENABLE_STRICT_OBJC_MSGSEND = YES;
				ENABLE_TESTABILITY = YES;
				GCC_C_LANGUAGE_STANDARD = gnu17;
				GCC_DYNAMIC_NO_PIC = NO;
				GCC_NO_COMMON_BLOCKS = YES;
				GCC_OPTIMIZATION_LEVEL = 0;
				GCC_PREPROCESSOR_DEFINITIONS = (
					"DEBUG=1",
					"$(inherited)",
				);
				GCC_WARN_64_TO_32_BIT_CONVERSION = YES;
				GCC_WARN_ABOUT_RETURN_TYPE = YES_ERROR;
				GCC_WARN_UNDECLARED_SELECTOR = YES;
				GCC_WARN_UNINITIALIZED_AUTOS = YES_AGGRESSIVE;
				GCC_WARN_UNUSED_FUNCTION = YES;
				GCC_WARN_UNUSED_VARIABLE = YES;
				GENERATE_INFOPLIST_FILE = YES;
				INFOPLIST_FILE = Kabala/Info.plist;
				INFOPLIST_KEY_UIApplicationSupportsIndirectInputEvents = YES;
				INFOPLIST_KEY_UILaunchStoryboardName = LaunchScreen;
				INFOPLIST_KEY_UISupportedInterfaceOrientations_iPad = "UIInterfaceOrientationPortrait UIInterfaceOrientationPortraitUpsideDown UIInterfaceOrientationLandscapeLeft UIInterfaceOrientationLandscapeRight";
				INFOPLIST_KEY_UISupportedInterfaceOrientations_iPhone = UIInterfaceOrientationPortrait;
				IPHONEOS_DEPLOYMENT_TARGET = 16.0; // <<< Set target iOS version
				LD_RUNPATH_SEARCH_PATHS = (
					"$(inherited)",
					"@executable_path/Frameworks",
				);
				LOCALIZATION_PREFERS_STRING_CATALOGS = YES;
				MARKETING_VERSION = "1.0";
				MTL_ENABLE_DEBUG_INFO = INCLUDE_SOURCE;
				MTL_FAST_MATH = YES;
				ONLY_ACTIVE_ARCH = YES;
				OTHER_LDFLAGS = "$(inherited)";
				PRODUCT_BUNDLE_IDENTIFIER = "today.youlove.Kabala"; // <<< Set Bundle ID
				PRODUCT_NAME = "$(TARGET_NAME)";
				SWIFT_ACTIVE_COMPILATION_CONDITIONS = "DEBUG $(inherited)";
				SWIFT_OPTIMIZATION_LEVEL = "-Onone";
				SWIFT_PRECOMPILE_BRIDGING_HEADER = YES;
				SWIFT_VERSION = 5.0;
				TARGETED_DEVICE_FAMILY = 1; // 1 = iPhone
				SUPPORTS_MACCATALYST = NO;
			};
			name = Debug;
		};
		04C1C9C52C3A6E9100E0A7F7 /* Release */ = {
			isa = XCBuildConfiguration;
			buildSettings = {
				ACCELERATE_ในการใช้งาน_PREFER_SWIFT = YES;
				ALWAYS_SEARCH_USER_PATHS = NO;
				ASSETCATALOG_COMPILER_APPICON_NAME = AppIcon;
				ASSETCATALOG_COMPILER_DEVELOPMENT_LANGUAGE = en;
				ASSETCATALOG_COMPILER_GLOBAL_ACCENT_COLOR_NAME = AccentColor;
				CLANG_ANALYZER_NONNULL = YES;
				CLANG_ANALYZER_NUMBER_OBJECT_CONVERSION = YES_AGGRESSIVE;
				CLANG_CXX_LANGUAGE_STANDARD = "gnu++20";
				CLANG_ENABLE_MODULES = YES;
				CLANG_ENABLE_OBJC_ARC = YES;
				CLANG_ENABLE_OBJC_WEAK = YES;
				CLANG_WARN_BLOCK_CAPTURE_AUTORELEASING = YES;
				CLANG_WARN_BOOL_CONVERSION = YES;
				CLANG_WARN_COMMA = YES;
				CLANG_WARN_CONSTANT_CONVERSION = YES;
				CLANG_WARN_DEPRECATED_OBJC_IMPLEMENTATIONS = YES;
				CLANG_WARN_DIRECT_OBJC_ISA_USAGE = YES_ERROR;
				CLANG_WARN_DOCUMENTATION_COMMENTS = YES;
				CLANG_WARN_EMPTY_BODY = YES;
				CLANG_WARN_ENUM_CONVERSION = YES;
				CLANG_WARN_INFINITE_RECURSION = YES;
				CLANG_WARN_INT_CONVERSION = YES;
				CLANG_WARN_NON_LITERAL_NULL_CONVERSION = YES;
				CLANG_WARN_OBJC_IMPLICIT_RETAIN_SELF = YES;
				CLANG_WARN_OBJC_LITERAL_CONVERSION = YES;
				CLANG_WARN_OBJC_ROOT_CLASS = YES_ERROR;
				CLANG_WARN_QUOTED_INCLUDE_IN_FRAMEWORK_HEADER = YES;
				CLANG_WARN_RANGE_LOOP_ANALYSIS = YES;
				CLANG_WARN_STRICT_PROTOTYPES = YES;
				CLANG_WARN_SUSPICIOUS_MOVE = YES;
				CLANG_WARN_UNGUARDED_AVAILABILITY = YES_AGGRESSIVE;
				CLANG_WARN_UNREACHABLE_CODE = YES;
				CLANG_WARN__DUPLICATE_METHOD_MATCH = YES;
				CODE_SIGN_IDENTITY = "Apple Development";
				COPY_PHASE_STRIP = NO;
				CREATE_INFOPLIST_SECTION_IN_BINARY = NO;
				DEBUG_INFORMATION_FORMAT = "dwarf-with-dsym";
				ENABLE_NS_ASSERTIONS = NO;
				ENABLE_STRICT_OBJC_MSGSEND = YES;
				GCC_C_LANGUAGE_STANDARD = gnu17;
				GCC_NO_COMMON_BLOCKS = YES;
				GCC_WARN_64_TO_32_BIT_CONVERSION = YES;
				GCC_WARN_ABOUT_RETURN_TYPE = YES_ERROR;
				GCC_WARN_UNDECLARED_SELECTOR = YES;
				GCC_WARN_UNINITIALIZED_AUTOS = YES_AGGRESSIVE;
				GCC_WARN_UNUSED_FUNCTION = YES;
				GCC_WARN_UNUSED_VARIABLE = YES;
				GENERATE_INFOPLIST_FILE = YES;
				INFOPLIST_FILE = Kabala/Info.plist;
				INFOPLIST_KEY_UIApplicationSupportsIndirectInputEvents = YES;
				INFOPLIST_KEY_UILaunchStoryboardName = LaunchScreen;
				INFOPLIST_KEY_UISupportedInterfaceOrientations_iPad = "UIInterfaceOrientationPortrait UIInterfaceOrientationPortraitUpsideDown UIInterfaceOrientationLandscapeLeft UIInterfaceOrientationLandscapeRight";
				INFOPLIST_KEY_UISupportedInterfaceOrientations_iPhone = UIInterfaceOrientationPortrait;
				IPHONEOS_DEPLOYMENT_TARGET = 16.0; // <<< Set target iOS version
				LD_RUNPATH_SEARCH_PATHS = (
					"$(inherited)",
					"@executable_path/Frameworks",
				);
				LOCALIZATION_PREFERS_STRING_CATALOGS = YES;
				MARKETING_VERSION = "1.0";
				MTL_ENABLE_DEBUG_INFO = NO;
				MTL_FAST_MATH = YES;
				OTHER_LDFLAGS = "$(inherited)";
				PRODUCT_BUNDLE_IDENTIFIER = "today.youlove.Kabala"; // <<< Set Bundle ID
				PRODUCT_NAME = "$(TARGET_NAME)";
				SWIFT_COMPILATION_MODE = wholemodule;
				SWIFT_EMIT_LOC_STRINGS = YES;
				SWIFT_OPTIMIZATION_LEVEL = "-O";
				SWIFT_PRECOMPILE_BRIDGING_HEADER = YES;
				SWIFT_VERSION = 5.0;
				TARGETED_DEVICE_FAMILY = 1; // 1 = iPhone
				VALIDATE_PRODUCT = YES;
				SUPPORTS_MACCATALYST = NO;
			};
			name = Release;
		};
		04C1C9C72C3A6E9100E0A7F7 /* Debug */ = {
			isa = XCBuildConfiguration;
			buildSettings = {
				DEVELOPMENT_TEAM = ""; // <<< YOU MUST SET THIS IN XCODE FOR DEVICE BUILDS
				PRODUCT_BUNDLE_IDENTIFIER = "today.youlove.Kabala"; // <<< Set Bundle ID
				SUPPORTS_MACCATALYST = NO;
				TARGETED_DEVICE_FAMILY = 1;
			};
			name = Debug;
		};
		04C1C9C82C3A6E9100E0A7F7 /* Release */ = {
			isa = XCBuildConfiguration;
			buildSettings = {
				DEVELOPMENT_TEAM = ""; // <<< YOU MUST SET THIS IN XCODE FOR DEVICE BUILDS
				PRODUCT_BUNDLE_IDENTIFIER = "today.youlove.Kabala"; // <<< Set Bundle ID
				SUPPORTS_MACCATALYST = NO;
				TARGETED_DEVICE_FAMILY = 1;
			};
			name = Release;
		};
/* End XCBuildConfiguration section */

/* Begin XCConfigurationList section */
		04C1C9B12C3A6E9100E0A7F7 /* Build configuration list for PBXProject "Kabala" */ = {
			isa = XCConfigurationList;
			buildConfigurations = (
				04C1C9C42C3A6E9100E0A7F7 /* Debug */,
				04C1C9C52C3A6E9100E0A7F7 /* Release */,
			);
			defaultConfigurationIsVisible = 0;
			defaultConfigurationName = Release;
		};
		04C1C9C62C3A6E9100E0A7F7 /* Build configuration list for PBXNativeTarget "Kabala" */ = {
			isa = XCConfigurationList;
			buildConfigurations = (
				04C1C9C72C3A6E9100E0A7F7 /* Debug */,
				04C1C9C82C3A6E9100E0A7F7 /* Release */,
			);
			defaultConfigurationIsVisible = 0;
			defaultConfigurationName = Release;
		};
/* End XCConfigurationList section */
	};
	rootObject = 04C1C9B42C3A6E9100E0A7F7 /* Project object */;
}

EOF
echo "      Created project.pbxproj"

# --- Create Source Code Directory Structure ---
echo "   Creating source directories..."
mkdir "$PROJECT_NAME"
mkdir "$PROJECT_NAME/Data"
mkdir "$PROJECT_NAME/Models"
mkdir "$PROJECT_NAME/Utils"
mkdir "$PROJECT_NAME/Views"
mkdir "$PROJECT_NAME/Views/Authentication"
mkdir "$PROJECT_NAME/Views/Common"
mkdir "$PROJECT_NAME/Views/Dashboard"
mkdir "$PROJECT_NAME/Views/Finances"

# --- Create Swift Source Files ---
echo "   Creating Swift files..."

# KabalaApp.swift
cat << 'EOF' > "$PROJECT_NAME/KabalaApp.swift"
import SwiftUI

@main
struct KabalaApp: App {
    @StateObject private var userDataManager = UserDataManager()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(userDataManager)
                .preferredColorScheme(.dark)
        }
    }
}
EOF

# ContentView.swift (Connects Auth State to Views)
cat << 'EOF' > "$PROJECT_NAME/Views/ContentView.swift"
import SwiftUI

struct ContentView: View {
    @EnvironmentObject var userDataManager: UserDataManager

    var body: some View {
        Group {
            if userDataManager.isAuthenticated {
                 MainTabView()
                     .transition(.opacity.animation(.easeInOut(duration: 0.4)))
            } else {
                 AuthContainerView()
                     .transition(.opacity.animation(.easeInOut(duration: 0.4)))
            }
        }
    }
}
EOF

# --- Data ---
cat << 'EOF' > "$PROJECT_NAME/Data/UserDataManager.swift"
import Foundation
import Combine
import SwiftUI // For @Published

class UserDataManager: ObservableObject {
    @Published var financialMetrics: FinancialMetrics { didSet { saveFinancialMetrics() } }
    @Published var goals: [Goal] { didSet { saveGoals() } }
    @Published var isAuthenticated: Bool = UserDefaults.standard.bool(forKey: Keys.isAuthenticated) {
       didSet {
           UserDefaults.standard.set(isAuthenticated, forKey: Keys.isAuthenticated)
           // if !isAuthenticated { resetData() } // Optional: Reset on logout
       }
    }

    private struct Keys {
        static let financialMetrics = "financialMetricsData_v1"
        static let financialGoals = "financialGoalsData_v1"
        static let isAuthenticated = "isAuthenticated_v1"
    }

    init() {
        self.financialMetrics = Self.loadFinancialMetrics()
        self.goals = Self.loadGoals()
        if self.goals.isEmpty {
            self.goals = Goal.sampleGoals
            saveGoals()
        }
        if self.financialMetrics.monthlySalary == 0 && self.financialMetrics.monthlyExpenses == 0 {
             self.financialMetrics = FinancialMetrics()
             saveFinancialMetrics()
        }
        print("UserDataManager Initialized. Auth: \(isAuthenticated)")
    }

    private static func loadFinancialMetrics() -> FinancialMetrics {
        guard let data = UserDefaults.standard.data(forKey: Keys.financialMetrics),
              let decoded = try? JSONDecoder().decode(FinancialMetrics.self, from: data) else {
            print("⚠️ No financial metrics found, using defaults.")
            return FinancialMetrics()
        }
        print("✅ Loaded financial metrics.")
        return decoded
    }

    private func saveFinancialMetrics() {
        do {
            let encoded = try JSONEncoder().encode(financialMetrics)
            UserDefaults.standard.set(encoded, forKey: Keys.financialMetrics)
            print("💾 Financial metrics saved.")
            objectWillChange.send()
        } catch { print("❌ Error saving financial metrics: \(error)") }
    }

    private static func loadGoals() -> [Goal] {
        guard let data = UserDefaults.standard.data(forKey: Keys.financialGoals),
              let decoded = try? JSONDecoder().decode([Goal].self, from: data) else {
            print("⚠️ No goals found, returning samples.")
            return [] // Let init handle adding samples
        }
        print("✅ Loaded \(decoded.count) goals.")
        return decoded
    }

    private func saveGoals() {
         do {
            let encoded = try JSONEncoder().encode(goals)
            UserDefaults.standard.set(encoded, forKey: Keys.financialGoals)
             print("💾 Goals saved (\(goals.count) total).")
            objectWillChange.send()
         } catch { print("❌ Error saving goals: \(error)") }
    }

    func addGoal(title: String, targetAmount: Double, priority: Priority) {
         guard !title.isEmpty, targetAmount > 0 else { return }
         let newGoal = Goal(title: title, targetAmount: targetAmount, priority: priority)
         goals.append(newGoal)
         print("➕ Goal added: \(title)")
    }

    func updateGoal(_ updatedGoal: Goal) {
        if let index = goals.firstIndex(where: { $0.id == updatedGoal.id }) {
            goals[index] = updatedGoal
             print("🔄 Goal updated: \(updatedGoal.title)")
        }
    }

    func deleteGoal(_ goalToDelete: Goal) {
         goals.removeAll { $0.id == goalToDelete.id }
          print("➖ Goal deleted: \(goalToDelete.title)")
    }

    func deleteGoals(at offsets: IndexSet) {
        goals.remove(atOffsets: offsets)
         print("➖ Goals deleted at offsets: \(offsets)")
    }

    func moveGoals(from source: IndexSet, to destination: Int) {
        goals.move(fromOffsets: source, toOffset: destination)
        print("↕️ Goals moved.")
    }

    func estimatedCompletionDate(for targetGoal: Goal) -> Date? {
        let monthlySavings = financialMetrics.monthlySavings
        guard monthlySavings > 0, !targetGoal.isCompleted else { return targetGoal.isCompleted ? Date() : nil }

        let sortedGoals = goals.filter { !$0.isCompleted }.sorted {
            if $0.priority.sortOrder != $1.priority.sortOrder { return $0.priority.sortOrder > $1.priority.sortOrder }
            if $0.remainingAmount != $1.remainingAmount { return $0.remainingAmount < $1.remainingAmount }
            return $0.createdAt < $1.createdAt
        }

        var cumulativeSavingsRequired: Double = 0
        for goal in sortedGoals {
            cumulativeSavingsRequired += goal.remainingAmount
            if goal.id == targetGoal.id {
                let monthsNeeded = cumulativeSavingsRequired / monthlySavings
                guard monthsNeeded.isFinite, monthsNeeded >= 0 else { return nil }
                return Calendar.current.date(byAdding: .month, value: Int(ceil(monthsNeeded)), to: Date())
            }
        }
        return nil
    }

    func resetData() {
        print("⚠️ Resetting all user data!")
        UserDefaults.standard.removeObject(forKey: Keys.financialMetrics)
        UserDefaults.standard.removeObject(forKey: Keys.financialGoals)
        // Keep auth state? UserDefaults.standard.removeObject(forKey: Keys.isAuthenticated)
        financialMetrics = FinancialMetrics()
        goals = Goal.sampleGoals
        // isAuthenticated = false // Optional logout on reset
        saveFinancialMetrics()
        saveGoals()
        // UserDefaults.standard.set(isAuthenticated, forKey: Keys.isAuthenticated)
        print("✅ User data reset to defaults.")
        objectWillChange.send()
    }
}
EOF

# --- Models ---
cat << 'EOF' > "$PROJECT_NAME/Models/FinancialMetrics.swift"
import Foundation

struct FinancialMetrics: Codable {
    var monthlySalary: Double = 5000
    var monthlyExpenses: Double = 2000

    var monthlySavings: Double { max(0, monthlySalary - monthlyExpenses) }
    var savingsRate: Double {
        guard monthlySalary > 0 else { return 0 }
        return max(0, min(100, (monthlySavings / monthlySalary) * 100))
    }
}
EOF

cat << 'EOF' > "$PROJECT_NAME/Models/Goal.swift"
import Foundation
import SwiftUI

enum Priority: String, Codable, CaseIterable, Identifiable {
    case high = "High", medium = "Medium", low = "Low"
    var id: String { self.rawValue }
    var sortOrder: Int { switch self { case .high: 3 case .medium: 2 case .low: 1 } }
    var color: Color { switch self { case .high: .red case .medium: .orange case .low: .teal } }
}

struct Goal: Identifiable, Codable, Hashable {
    var id = UUID()
    var title: String
    var targetAmount: Double
    var currentAmount: Double = 0
    var priority: Priority = .medium
    var createdAt: Date = Date()

    var progress: Double { targetAmount > 0 ? min(1.0, max(0, currentAmount / targetAmount)) : 0 }
    var remainingAmount: Double { max(0, targetAmount - currentAmount) }
    var isCompleted: Bool { progress >= 1.0 }

    static let predefinedTitles = [
        "Travel (Europe)", "Travel (Asia)", "Travel (America)", "Car (Medium)", "Car (Premium)",
        "Apartment (Economy)", "Apartment (Comfort)", "Apartment (Business)", "Emergency Fund",
        "Down Payment", "Education"
    ]
    static var sampleGoals: [Goal] = [
        Goal(title: "Emergency Fund", targetAmount: 10000, currentAmount: 4500, priority: .high, createdAt: Calendar.current.date(byAdding: .day, value: -30, to: Date())!),
        Goal(title: "Travel (Europe)", targetAmount: 5000, currentAmount: 1500, priority: .medium, createdAt: Calendar.current.date(byAdding: .day, value: -60, to: Date())!),
        Goal(title: "Car (Medium)", targetAmount: 25000, currentAmount: 8000, priority: .medium, createdAt: Calendar.current.date(byAdding: .day, value: -10, to: Date())!),
    ]
}
EOF

# --- Utils ---
cat << 'EOF' > "$PROJECT_NAME/Utils/Colors.swift"
import SwiftUI

extension Color { static let theme = ColorTheme() }

struct ColorTheme {
    let background = Color("BackgroundColor")
    let surface = Color("SurfaceColor")
    let primaryText = Color("PrimaryTextColor")
    let secondaryText = Color("SecondaryTextColor")
    let accentGold = Color("AccentGoldColor")
    let accentNavy = Color("AccentNavyColor")
    let accentTeal = Color("AccentTealColor")
}
// Asset Catalog setup is crucial and done later in the script
EOF

cat << 'EOF' > "$PROJECT_NAME/Utils/Fonts.swift"
import SwiftUI

// Custom Font Styles using ViewModifiers
struct BoldHeadingModifier: ViewModifier {
    func body(content: Content) -> some View {
        content.font(.system(size: 22, weight: .bold)).foregroundColor(Color.theme.primaryText)
    }
}
struct CleanBodyTextModifier: ViewModifier {
    func body(content: Content) -> some View {
        content.font(.system(size: 16, weight: .regular)).foregroundColor(Color.theme.secondaryText)
    }
}
struct HighlightedBodyTextModifier: ViewModifier {
    func body(content: Content) -> some View {
        content.font(.system(size: 16, weight: .medium)).foregroundColor(Color.theme.primaryText)
    }
}
struct CaptionTextModifier: ViewModifier {
    func body(content: Content) -> some View {
        content.font(.system(size: 12, weight: .regular)).foregroundColor(Color.theme.secondaryText)
    }
}
struct BoldCaptionTextModifier: ViewModifier {
     func body(content: Content) -> some View {
         content.font(.system(size: 12, weight: .bold)).foregroundColor(Color.theme.primaryText)
     }
 }

extension View {
    func boldHeadingStyle() -> some View { modifier(BoldHeadingModifier()) }
    func cleanBodyStyle() -> some View { modifier(CleanBodyTextModifier()) }
    func highlightedBodyStyle() -> some View { modifier(HighlightedBodyTextModifier()) }
    func captionStyle() -> some View { modifier(CaptionTextModifier()) }
    func boldCaptionStyle() -> some View { modifier(BoldCaptionTextModifier()) }
}
EOF

cat << 'EOF' > "$PROJECT_NAME/Utils/Formatters.swift"
import Foundation

struct Formatters {
    static let currencyFormatter: NumberFormatter = {
        let f = NumberFormatter(); f.numberStyle = .currency; f.maximumFractionDigits = 0; f.currencySymbol = Locale.current.currencySymbol ?? "$"; return f }()
    static let preciseCurrencyFormatter: NumberFormatter = {
        let f = NumberFormatter(); f.numberStyle = .currency; f.maximumFractionDigits = 2; f.minimumFractionDigits = 2; f.currencySymbol = Locale.current.currencySymbol ?? "$"; return f }()
    static let percentageFormatter: NumberFormatter = {
        let f = NumberFormatter(); f.numberStyle = .percent; f.maximumFractionDigits = 1; f.minimumFractionDigits = 0; f.multiplier = 1; return f }()
    static let monthYearFormatter: DateFormatter = {
        let f = DateFormatter(); f.dateFormat = "MMM yyyy"; return f }()
    static let mediumDateFormatter: DateFormatter = {
        let f = DateFormatter(); f.dateStyle = .medium; f.timeStyle = .none; return f }()
}
extension Double {
    func formattedCurrency() -> String { Formatters.currencyFormatter.string(from: NSNumber(value: self)) ?? "\(self)" }
    func formattedPreciseCurrency() -> String { Formatters.preciseCurrencyFormatter.string(from: NSNumber(value: self)) ?? "\(self)" }
    func formattedPercentage() -> String { Formatters.percentageFormatter.string(from: NSNumber(value: self)) ?? "\(self)%" }
}
extension Date {
    func formattedMonthYear() -> String { Formatters.monthYearFormatter.string(from: self) }
    func formattedMediumDate() -> String { Formatters.mediumDateFormatter.string(from: self) }
}
EOF

# --- Views ---

# --- Views/Authentication ---
cat << 'EOF' > "$PROJECT_NAME/Views/Authentication/AuthContainerView.swift"
import SwiftUI
import UIKit // For haptics, keyboard types

struct AuthContainerView: View {
    @State private var authMode: AuthMode = .signIn
    @State private var logoAnimationState = false
    @EnvironmentObject var userDataManager: UserDataManager

    enum AuthMode { case signIn, signUp }

    var body: some View {
        ZStack {
            LinearGradient(gradient: Gradient(colors: [Color.theme.background, Color.theme.background.opacity(0.8)]), startPoint: .top, endPoint: .bottom).ignoresSafeArea()
            VStack(spacing: 30) {
                Spacer(minLength: 40)
                Image(systemName: "leaf.fill") // Replace logo later
                    .resizable().scaledToFit().frame(width: 80, height: 80).foregroundColor(Color.theme.accentGold)
                    .rotationEffect(.degrees(logoAnimationState ? 10 : -5)).scaleEffect(logoAnimationState ? 1.05 : 0.95)
                    .shadow(color: Color.theme.accentGold.opacity(0.5), radius: logoAnimationState ? 15 : 5, x: 0, y: 5)
                    .onAppear { withAnimation(.easeInOut(duration: 2.5).repeatForever(autoreverses: true)) { logoAnimationState.toggle() } }
                    .padding(.bottom, 30)

                Picker("Mode", selection: $authMode.animation(.easeInOut)) {
                    Text("Sign In").tag(AuthMode.signIn)
                    Text("Sign Up").tag(AuthMode.signUp)
                }.pickerStyle(SegmentedPickerStyle()).padding(.horizontal, 40)

                Group {
                    if authMode == .signIn { SignInView(onSignIn: handleAuthentication) }
                    else { SignUpView(onSignUp: handleAuthentication) }
                }
                .transition(.asymmetric(
                    insertion: .move(edge: authMode == .signIn ? .leading : .trailing).combined(with: .opacity),
                    removal: .move(edge: authMode == .signIn ? .trailing : .leading).combined(with: .opacity))
                )
                .animation(.easeInOut(duration: 0.4), value: authMode)

                Spacer()
                VStack(spacing: 15) {
                    Text("Or continue with").captionStyle()
                    HStack(spacing: 25) {
                        SocialLoginButton(iconName: "apple.logo")
                        SocialLoginButton(iconName: "g.circle.fill")
                        SocialLoginButton(iconName: "f.cursive.circle.fill")
                    }
                }.padding(.bottom, 40)
            }.padding(.top, 20)
        }
    }

    func handleAuthentication() {
        Haptics.shared.mediumImpact()
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
            withAnimation(.easeInOut(duration: 0.5)) { userDataManager.isAuthenticated = true }
        }
    }
}

struct SignInView: View {
    @State private var email = ""; @State private var password = ""
    @State private var emailError: String? = nil; @State private var passwordError: String? = nil
    @State private var isLoading = false
    var onSignIn: () -> Void

    var body: some View {
        VStack(spacing: 20) {
            AuthTextField(placeholder: "Email", text: $email, error: $emailError, keyboardType: .emailAddress, iconName: "envelope.fill")
            AuthTextField(placeholder: "Password", text: $password, error: $passwordError, isSecure: true, iconName: "lock.fill")
            AuthButton(title: "Sign In", isLoading: $isLoading, action: validateAndSignIn)
        }.padding(.horizontal, 40)
    }

    func validateAndSignIn() {
        emailError = email.isValidEmail() ? nil : "Enter a valid email address"
        passwordError = password.isEmpty ? nil : "Password cannot be empty" // Corrected logic
        if emailError == nil && passwordError == nil {
            isLoading = true
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) { isLoading = false; onSignIn() }
        } else { Haptics.shared.error() }
    }
}

struct SignUpView: View {
    @State private var email = ""; @State private var password = ""; @State private var confirmPassword = ""
    @State private var emailError: String? = nil; @State private var passwordError: String? = nil; @State private var confirmPasswordError: String? = nil
    @State private var isLoading = false
    var onSignUp: () -> Void

    var body: some View {
        VStack(spacing: 20) {
             AuthTextField(placeholder: "Email", text: $email, error: $emailError, keyboardType: .emailAddress, iconName: "envelope.fill")
             AuthTextField(placeholder: "Password", text: $password, error: $passwordError, isSecure: true, iconName: "lock.fill")
             AuthTextField(placeholder: "Confirm Password", text: $confirmPassword, error: $confirmPasswordError, isSecure: true, iconName: "lock.fill")
             AuthButton(title: "Create Account", isLoading: $isLoading, action: validateAndSignUp)
        }.padding(.horizontal, 40)
    }

     func validateAndSignUp() {
        emailError = email.isValidEmail() ? nil : "Enter a valid email address"
        passwordError = password.count >= 6 ? nil : "Password min 6 characters"
        confirmPasswordError = (password == confirmPassword && !password.isEmpty) ? nil : "Passwords do not match"
        if emailError == nil && passwordError == nil && confirmPasswordError == nil {
            isLoading = true
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.7) { isLoading = false; onSignUp() }
        } else { Haptics.shared.error() }
    }
}

struct AuthTextField: View {
     let placeholder: String; @Binding var text: String; @Binding var error: String?
     var isSecure: Bool = false; var keyboardType: UIKeyboardType = .default; var iconName: String? = nil
     @FocusState private var isFocused: Bool; @State private var fieldHeight: CGFloat = 50

     var body: some View {
         VStack(alignment: .leading, spacing: 4) {
             HStack(spacing: 10) {
                 if let iconName = iconName { Image(systemName: iconName).foregroundColor(isFocused ? Color.theme.accentGold : Color.theme.secondaryText.opacity(0.7)).frame(width: 20, alignment: .center) }
                 Group {
                     if isSecure { SecureField(placeholder, text: $text).textContentType(.password) }
                     else { TextField(placeholder, text: $text).keyboardType(keyboardType).autocapitalization(keyboardType == .emailAddress ? .none : .words).disableAutocorrection(keyboardType == .emailAddress || isSecure).textContentType(keyboardType == .emailAddress ? .emailAddress : .none) }
                 }
                 .foregroundColor(Color.theme.primaryText).accentColor(Color.theme.accentGold).focused($isFocused)
                 .onChange(of: isFocused) { focused in if focused { clearErrorWithAnimation() } }
                 .onChange(of: text) { _ in if isFocused { clearErrorWithAnimation() } }

                 if isFocused && !text.isEmpty { Button { text = "" } label: { Image(systemName: "xmark.circle.fill").foregroundColor(Color.theme.secondaryText.opacity(0.5)) }.padding(.trailing, 5) }
             }
             .padding(.horizontal, 15).frame(height: fieldHeight)
             .background(RoundedRectangle(cornerRadius: 10).fill(Color.theme.surface.opacity(0.8)).stroke(borderColor, lineWidth: borderWidth))
             .animation(.easeInOut(duration: 0.2), value: isFocused)
             .animation(.easeInOut(duration: 0.2), value: error != nil)

             HStack {
                 if let error = error, !error.isEmpty { Text(error).font(.caption).foregroundColor(.red.opacity(0.9)).transition(.opacity.combined(with: .offset(y: -2))) }
                 Spacer()
             }.padding(.horizontal, 5).frame(height: 15)
         }
     }

     private var borderColor: Color { error != nil ? .red : (isFocused ? Color.theme.accentGold : Color.theme.surface) }
     private var borderWidth: CGFloat { (isFocused || error != nil) ? 1.5 : 1.0 }
     private func clearErrorWithAnimation() { withAnimation(.easeInOut(duration: 0.3)) { error = nil } }
 }

 struct AuthButton: View {
     let title: String; @Binding var isLoading: Bool; let action: () -> Void; @State private var isPressed = false

     var body: some View {
         Button(action: { if !isLoading { action(); Haptics.shared.mediumImpact() } }) {
             ZStack {
                  Text(title).font(.system(size: 16, weight: .semibold)).frame(maxWidth: .infinity).frame(height: 50)
                      .background(LinearGradient(gradient: Gradient(colors: [Color.theme.accentGold.opacity(isLoading ? 0.6 : 0.9), Color.theme.accentGold.opacity(isLoading ? 0.8 : 1.0)]), startPoint: .top, endPoint: .bottom))
                      .cornerRadius(10).foregroundColor(isLoading ? Color.theme.surface.opacity(0.7) : Color.theme.surface)
                      .shadow(color: Color.theme.accentGold.opacity(isPressed ? 0.2 : 0.4), radius: isPressed ? 3 : 6, x: 0, y: isPressed ? 2 : 4)
                      .scaleEffect(isPressed ? 0.97 : 1.0).opacity(isLoading ? 0 : 1)
                 if isLoading { ProgressView().progressViewStyle(CircularProgressViewStyle(tint: Color.theme.surface)).frame(height: 50).transition(.opacity.animation(.easeInOut(duration: 0.3))) }
             }
         }
         .buttonStyle(PlainButtonStyle()).disabled(isLoading)
         .pressEvents { withAnimation(.spring(response: 0.2, dampingFraction: 0.6)) { isPressed = true } } onRelease: { withAnimation(.spring(response: 0.2, dampingFraction: 0.6)) { isPressed = false } }
         .animation(.easeInOut(duration: 0.3), value: isLoading)
         .animation(.spring(response: 0.3, dampingFraction: 0.6), value: isPressed)
     }
 }

struct SocialLoginButton: View {
    let iconName: String; @State private var isPressed = false
    var body: some View {
        Button(action: { Haptics.shared.lightImpact() }) {
            Image(systemName: iconName).font(.title2).foregroundColor(Color.theme.primaryText.opacity(0.9))
                .frame(width: 55, height: 55)
                .background(Circle().fill(Color.theme.surface).shadow(color: .black.opacity(isPressed ? 0.1 : 0.2), radius: isPressed ? 2 : 5, x: 0, y: isPressed ? 1 : 3))
                .scaleEffect(isPressed ? 0.95 : 1.0)
        }
        .buttonStyle(PlainButtonStyle())
        .pressEvents { withAnimation(.spring(response: 0.2, dampingFraction: 0.7)) { isPressed = true } } onRelease: { withAnimation(.spring(response: 0.2, dampingFraction: 0.7)) { isPressed = false } }
        .animation(.spring(response: 0.2, dampingFraction: 0.7), value: isPressed)
    }
}

// Utils for Auth
extension String { func isValidEmail() -> Bool { NSPredicate(format:"SELF MATCHES %@", "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}").evaluate(with: self) } }

class Haptics { // Simple Haptics Manager
    static let shared = Haptics()
    private func impact(_ style: UIImpactFeedbackGenerator.FeedbackStyle) { let g = UIImpactFeedbackGenerator(style: style); g.prepare(); g.impactOccurred() }
    private func notification(_ type: UINotificationFeedbackGenerator.FeedbackType) { let g = UINotificationFeedbackGenerator(); g.prepare(); g.notificationOccurred(type) }
    func lightImpact() { impact(.light) }; func mediumImpact() { impact(.medium) }; func heavyImpact() { impact(.heavy) }
    func error() { notification(.error) }; func success() { notification(.success) }; func warning() { notification(.warning) }
}

struct PressActions: ViewModifier { // Press state helper
    var onPress: () -> Void; var onRelease: () -> Void
    func body(content: Content) -> some View { content.simultaneousGesture(DragGesture(minimumDistance: 0).onChanged({ _ in onPress() }).onEnded({ _ in onRelease() })) }
}
extension View { func pressEvents(onPress: @escaping (() -> Void), onRelease: @escaping (() -> Void)) -> some View { modifier(PressActions(onPress: onPress, onRelease: onRelease)) } }

EOF

# --- Views/Common ---
cat << 'EOF' > "$PROJECT_NAME/Views/Common/CircularProgressView.swift"
import SwiftUI

struct CircularProgressView: View {
    let progress: Double; let color: Color; var lineWidth: CGFloat = 8; var showBackgroundCircle: Bool = true
    private var clampedProgress: Double { max(0.0, min(1.0, progress)) }

    var body: some View {
        ZStack {
            if showBackgroundCircle { Circle().stroke(color.opacity(0.25), lineWidth: lineWidth) }
            Circle().trim(from: 0, to: clampedProgress).stroke(color, style: StrokeStyle(lineWidth: lineWidth, lineCap: .round))
                .rotationEffect(.degrees(-90)).animation(.easeInOut(duration: 0.8), value: clampedProgress)
        }
    }
}
EOF

# --- Views/Dashboard ---
cat << 'EOF' > "$PROJECT_NAME/Views/Dashboard/DashboardView.swift"
import SwiftUI
import Charts // Requires iOS 16+

struct DashboardView: View {
    @EnvironmentObject var userDataManager: UserDataManager
    @State private var showingSettingsSheet = false

    private var topGoals: [Goal] {
        userDataManager.goals.filter { !$0.isCompleted }.sorted {
            if $0.priority.sortOrder != $1.priority.sortOrder { return $0.priority.sortOrder > $1.priority.sortOrder }
            return $0.remainingAmount < $1.remainingAmount
        }.prefix(3).map { $0 }
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 25) {
                    FinancialSummaryCard(metrics: userDataManager.financialMetrics).padding(.top)
                    MonthlySavingsCard(savings: userDataManager.financialMetrics.monthlySavings, rate: userDataManager.financialMetrics.savingsRate)

                    if !topGoals.isEmpty {
                         SectionHeaderView(title: "Top Priorities")
                         HStack(spacing: 15) {
                             ForEach(topGoals) { GoalProgressCard(goal: $0) }
                             if topGoals.count < 3 { ForEach(0..<(3 - topGoals.count), id: \.self) { _ in Spacer() } }
                         }.padding(.horizontal)
                    } else if !userDataManager.goals.isEmpty {
                        SectionHeaderView(title: "Goals Status")
                        Text("🎉 All current goals achieved!").highlightedBodyStyle().frame(maxWidth: .infinity, alignment: .center).padding().background(Color.theme.surface).cornerRadius(12).padding(.horizontal)
                    } else {
                         SectionHeaderView(title: "Goals Status")
                         Text("No goals added yet. Go to the Finances tab!").cleanBodyStyle().frame(maxWidth: .infinity, alignment: .center).padding().background(Color.theme.surface).cornerRadius(12).padding(.horizontal)
                    }

                     SectionHeaderView(title: "Savings Projection")
                     if #available(iOS 16.0, *) {
                         if userDataManager.financialMetrics.monthlySavings > 0 && !userDataManager.goals.filter({!$0.isCompleted}).isEmpty {
                              SavingsChartView().padding(.horizontal) // Frame handled inside
                         } else if userDataManager.financialMetrics.monthlySavings <= 0 {
                             ChartMessageView(message: "Update income/expenses to see projections.")
                         } else { ChartMessageView(message: "Add goals in Finances tab!") }
                     } else { ChartMessageView(message: "Chart requires iOS 16+.") }

                     if !userDataManager.goals.isEmpty {
                          SectionHeaderView(title: "All Goals Overview")
                          TabView { ForEach(userDataManager.goals) { GoalDetailCard(goal: $0).padding(.horizontal, 5) } }
                          .frame(height: 170).tabViewStyle(PageTabViewStyle(indexDisplayMode: .automatic)).padding(.bottom)
                     }
                    Spacer(minLength: 20)
                }
            }
            .background(Color.theme.background.ignoresSafeArea())
            .navigationTitle("Dashboard")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button { showingSettingsSheet = true; Haptics.shared.lightImpact() } label: {
                        Image(systemName: "gearshape.fill").font(.title3).foregroundColor(Color.theme.accentGold)
                    }
                }
            }
            .sheet(isPresented: $showingSettingsSheet) { SettingsView().environmentObject(userDataManager) }
        }
    }
}

struct SectionHeaderView: View {
    let title: String
    var body: some View { Text(title).font(.title3).fontWeight(.semibold).foregroundColor(Color.theme.primaryText.opacity(0.9)).padding(.horizontal).padding(.bottom, -5) }
}

struct FinancialSummaryCard: View {
    let metrics: FinancialMetrics
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("NET MONTHLY SAVINGS").font(.caption).fontWeight(.semibold).foregroundColor(Color.theme.secondaryText.opacity(0.8)).textCase(.uppercase)
            HStack(alignment: .firstTextBaseline) {
                Text(metrics.monthlySavings.formattedCurrency())
                    .font(.system(size: 40, weight: .bold)).foregroundColor(metrics.monthlySavings >= 0 ? Color.theme.primaryText : .red)
                    .minimumScaleFactor(0.7).lineLimit(1)
                    .contentTransition(.numericText(countsDown: metrics.monthlySavings < 0)).animation(.spring(response: 0.4, dampingFraction: 0.8), value: metrics.monthlySavings)
                Text("/ month").font(.headline).foregroundColor(Color.theme.secondaryText).padding(.leading, 2)
            }
             Text("Salary (\(metrics.monthlySalary.formattedCurrency())) - Expenses (\(metrics.monthlyExpenses.formattedCurrency()))")
                 .font(.caption).foregroundColor(Color.theme.secondaryText.opacity(0.9)).padding(.top, 2)
        }
        .frame(maxWidth: .infinity, alignment: .leading).padding(20)
        .background(LinearGradient(gradient: Gradient(colors: [Color.theme.surface.opacity(0.9), Color.theme.surface]), startPoint: .topLeading, endPoint: .bottomTrailing))
        .cornerRadius(16).shadow(color: .black.opacity(0.25), radius: 8, x: 0, y: 4).padding(.horizontal)
    }
}

struct MonthlySavingsCard: View {
     let savings: Double; let rate: Double
     var body: some View {
         HStack(spacing: 15) {
             Image(systemName: "percent").font(.title).foregroundColor(Color.theme.accentTeal).frame(width: 30)
             VStack(alignment: .leading, spacing: 4) {
                 Text("Savings Rate").font(.headline).foregroundColor(Color.theme.primaryText)
                 Text(rate.formattedPercentage()).font(.title2).fontWeight(.semibold).foregroundColor(Color.theme.accentTeal)
                     .contentTransition(.numericText()).animation(.easeInOut, value: rate)
                 Text("of monthly income").captionStyle()
             }
             Spacer()
         }.padding().background(Color.theme.surface).cornerRadius(12).padding(.horizontal)
     }
 }

struct GoalProgressCard: View {
    let goal: Goal
    var body: some View {
        VStack(alignment: .center, spacing: 10) {
            CircularProgressView(progress: goal.progress, color: Color.theme.accentGold, lineWidth: 7).frame(width: 60, height: 60)
            Text(goal.title).highlightedBodyStyle().font(.footnote).lineLimit(2).multilineTextAlignment(.center).frame(height: 35)
            HStack(spacing: 4) {
                 PriorityBadge(priority: goal.priority, fontSize: .caption2)
                 Text("\(Int(goal.progress * 100))%").font(.footnote).fontWeight(.bold).foregroundColor(Color.theme.accentGold)
            }
        }
        .frame(maxWidth: .infinity).padding(.vertical, 15).padding(.horizontal, 8)
        .background(Color.theme.surface.opacity(0.9)).cornerRadius(12).shadow(color: .black.opacity(0.15), radius: 4, x: 0, y: 2)
    }
}

struct GoalDetailCard: View {
     let goal: Goal; @EnvironmentObject var userDataManager: UserDataManager
     var estimatedDateString: String {
         if goal.isCompleted { return "✅ Achieved!" }
         if let date = userDataManager.estimatedCompletionDate(for: goal) {
             if date > Calendar.current.date(byAdding: .year, value: 50, to: Date())! { return "> 50y" }
             return date.formattedMediumDate()
         } else { return userDataManager.financialMetrics.monthlySavings <= 0 ? "No Savings" : "Calculating..." }
     }
     var body: some View {
         VStack(alignment: .leading, spacing: 12) {
             HStack {
                 Text(goal.title).font(.title3).fontWeight(.semibold).foregroundColor(Color.theme.primaryText).lineLimit(1)
                 Spacer(); PriorityBadge(priority: goal.priority)
             }
             HStack {
                 VStack(alignment: .leading, spacing: 2) {
                     Text("Progress").captionStyle()
                     Text("\(goal.currentAmount.formattedCurrency()) / \(goal.targetAmount.formattedCurrency())")
                          .font(.subheadline).fontWeight(.medium).foregroundColor(Color.theme.primaryText).lineLimit(1).minimumScaleFactor(0.8)
                 }
                 Spacer()
                 VStack(alignment: .trailing, spacing: 2) {
                     Text("Est. Completion").captionStyle()
                     Text(estimatedDateString).font(.subheadline).fontWeight(.medium)
                          .foregroundColor(goal.isCompleted ? .green : Color.theme.accentTeal).lineLimit(1).minimumScaleFactor(0.8)
                 }
             }
             ProgressView(value: goal.progress).progressViewStyle(LinearProgressViewStyle(tint: Color.theme.accentGold))
                  .scaleEffect(x: 1, y: 2.5, anchor: .center).padding(.top, 5).animation(.easeInOut, value: goal.progress)
         }
         .padding(15).background(Color.theme.surface).cornerRadius(12).shadow(color: .black.opacity(0.15), radius: 4, x: 0, y: 2)
     }
 }

struct ChartMessageView: View {
     let message: String; var iconName: String = "chart.bar.xaxis.ascending"
     var body: some View {
         VStack(spacing: 10) {
             Image(systemName: iconName).font(.largeTitle).foregroundColor(Color.theme.secondaryText.opacity(0.5))
             Text(message).font(.callout).foregroundColor(Color.theme.secondaryText).multilineTextAlignment(.center).padding(.horizontal)
         }
         .frame(maxWidth: .infinity).frame(height: 250).background(Color.theme.surface.opacity(0.7)).cornerRadius(12).padding(.horizontal)
     }
 }

@available(iOS 16.0, *)
struct SavingsChartView: View {
    @EnvironmentObject var userDataManager: UserDataManager
    @State private var selectedDate: Date? = nil; @State private var selectedProjectedSavings: Double? = nil
    @State private var selectedMarkerGoal: Goal? = nil

    private var chartData: [(date: Date, projectedSavings: Double)] { // Projects savings from now
        var data: [(Date, Double)] = []; let monthlySavings = userDataManager.financialMetrics.monthlySavings
        guard let startOfMonth = Calendar.current.date(from: Calendar.current.dateComponents([.year, .month], from: Date())) else { return [] }
        data.append((date: startOfMonth, projectedSavings: 0))
        guard monthlySavings > 0 else { return data }
        for i in 1...24 { if let date = Calendar.current.date(byAdding: .month, value: i, to: startOfMonth) { data.append((date: date, projectedSavings: monthlySavings * Double(i))) } }
        return data
    }

    private var goalMarkers: [(date: Date, goal: Goal, cumulativeSavingsNeeded: Double)] { // Markers for incomplete goals
        var markers: [(Date, Goal, Double)] = []; let monthlySavings = userDataManager.financialMetrics.monthlySavings
        guard monthlySavings > 0 else { return [] }
        let sortedIncompleteGoals = userDataManager.goals.filter { !$0.isCompleted }.sorted { if $0.priority.sortOrder != $1.priority.sortOrder { return $0.priority.sortOrder > $1.priority.sortOrder }; if $0.remainingAmount != $1.remainingAmount { return $0.remainingAmount < $1.remainingAmount }; return $0.createdAt < $1.createdAt }
        var cumulativeSavingsRequired: Double = 0; let today = Date()
        for goal in sortedIncompleteGoals {
            cumulativeSavingsRequired += goal.remainingAmount; let monthsNeeded = cumulativeSavingsRequired / monthlySavings
            guard monthsNeeded.isFinite, monthsNeeded >= 0 else { continue }
            if let estimatedDate = Calendar.current.date(byAdding: .month, value: Int(ceil(monthsNeeded)), to: today) { markers.append((date: estimatedDate, goal: goal, cumulativeSavingsNeeded: cumulativeSavingsRequired)) }
        }
        guard let firstChartDate = chartData.first?.date, let maxDate = Calendar.current.date(byAdding: .month, value: 24, to: firstChartDate) else { return [] }
        return markers.filter { $0.date >= firstChartDate && $0.date <= maxDate }
    }

    var body: some View {
         Chart {
             ForEach(chartData, id: \.date) { item in // Line & Area
                 LineMark(x: .value("Month", item.date, unit: .month), y: .value("Savings", item.projectedSavings)).foregroundStyle(Color.theme.accentTeal).interpolationMethod(.catmullRom).lineStyle(StrokeStyle(lineWidth: 2.5))
                 AreaMark(x: .value("Month", item.date, unit: .month), yStart: .value("Min", 0), yEnd: .value("Max", item.projectedSavings)).foregroundStyle(LinearGradient(gradient: Gradient(colors: [Color.theme.accentTeal.opacity(0.4), .clear]), startPoint: .top, endPoint: .bottom)).interpolationMethod(.catmullRom)
             }
             ForEach(goalMarkers, id: \.goal.id) { marker in // Goal Markers
                 RuleMark(x: .value("Goal Date", marker.date)).foregroundStyle(Color.theme.accentGold.opacity(0.5)).lineStyle(StrokeStyle(lineWidth: 1, dash: [3, 3]))
                 PointMark(x: .value("Goal Date", marker.date), y: .value("Savings Level", marker.cumulativeSavingsNeeded)).foregroundStyle(Color.theme.accentGold).symbol(Circle()).symbolSize(selectedMarkerGoal?.id == marker.goal.id ? 100 : 60)
                  .annotation(position: .top, alignment: .center, spacing: 8) { Text(marker.goal.title.prefix(3).uppercased()).font(.system(size: 9, weight: .bold)).padding(.horizontal, 5).padding(.vertical, 2).background(Color.theme.surface.opacity(0.8)).foregroundColor(Color.theme.accentGold).clipShape(Capsule()).opacity(selectedMarkerGoal?.id == marker.goal.id ? 1.0 : 0.7) }
                 .zIndex(selectedMarkerGoal?.id == marker.goal.id ? 1 : 0)
             }
              if let selDate = selectedDate, let selSavings = selectedProjectedSavings { // Interaction RuleMark
                  RuleMark(x: .value("Selected Date", selDate)).foregroundStyle(Color.gray.opacity(0.7)).lineStyle(StrokeStyle(lineWidth: 1.5, dash: [4, 4]))
                      .annotation(position: .top, alignment: .leading, spacing: 5, overflowResolution: .init(x: .fit(to: .chart), y: .disabled)) {
                          VStack(alignment: .leading, spacing: 2) { Text(selDate.formattedMonthYear()).bold(); Text("Proj. \(selSavings.formattedCurrency())").foregroundColor(Color.theme.accentTeal).bold() }.font(.caption).padding(8).background(RoundedRectangle(cornerRadius: 6).fill(Color.theme.surface.opacity(0.9)).shadow(radius: 3))
                      }
              }
         }
         .chartXAxis { AxisMarks(values: .stride(by: .month, count: 3)) { val in AxisGridLine(stroke: StrokeStyle(lineWidth: 0.5, dash: [2, 3])).foregroundStyle(Color.theme.secondaryText.opacity(0.2)); AxisTick(stroke: StrokeStyle(lineWidth: 1)).foregroundStyle(Color.theme.secondaryText.opacity(0.3)); AxisValueLabel(format: .dateTime.month(.narrow).year(.twoDigits), centered: true).foregroundStyle(Color.theme.secondaryText).font(.caption2) } }
         .chartYAxis { AxisMarks(position: .leading, values: .automatic(desiredCount: 5)) { val in AxisGridLine(stroke: StrokeStyle(lineWidth: 0.5, dash: [2, 3])).foregroundStyle(Color.theme.secondaryText.opacity(0.2)); AxisTick(stroke: StrokeStyle(lineWidth: 1)).foregroundStyle(Color.theme.secondaryText.opacity(0.3)); AxisValueLabel { if let amt = val.as(Double.self) { Text(formatYAxisAmount(amt)) } }.foregroundStyle(Color.theme.secondaryText).font(.caption2) } }
         .chartOverlay { proxy in GeometryReader { geo in Rectangle().fill(.clear).contentShape(Rectangle())
             .gesture(DragGesture(minimumDistance: 0, coordinateSpace: .local).onChanged { handleDrag(value: $0, proxy: proxy, geometry: geo) }.onEnded { _ in clearSelection() })
             .onTapGesture(coordinateSpace: .local) { handleTap(location: $0, proxy: proxy, geometry: geo) }
         } }
         .frame(height: 250).padding(.top, 10).background(Color.theme.surface).cornerRadius(12).shadow(color: .black.opacity(0.15), radius: 4, x: 0, y: 2)
         .animation(.easeInOut, value: selectedMarkerGoal)
    }

    // --- Interaction Helpers (Simplified) ---
    private func handleDrag(value: DragGesture.Value, proxy: ChartProxy, geometry: GeometryProxy) {
        guard let plotFrame = proxy.plotFrame else { return }
        let origin = geometry[plotFrame].origin
        let location = CGPoint(x: value.location.x - origin.x, y: value.location.y - origin.y)
        guard location.x >= 0, location.x <= plotFrame.size.width, location.y >= 0, location.y <= plotFrame.size.height else { clearSelection(); return }
        if let date: Date = proxy.value(atX: location.x) {
            let closest = chartData.min(by: { abs($0.date.timeIntervalSince(date)) < abs($1.date.timeIntervalSince(date)) })
            if let pt = closest, selectedDate != pt.date { selectedDate = pt.date; selectedProjectedSavings = pt.projectedSavings; selectedMarkerGoal = nil; Haptics.shared.lightImpact() }
        }
    }
    private func handleTap(location: CGPoint, proxy: ChartProxy, geometry: GeometryProxy) {
        guard let plotFrame = proxy.plotFrame else { return }
        let origin = geometry[plotFrame].origin
        let plotLoc = CGPoint(x: location.x - origin.x, y: location.y - origin.y)
        let tappedMarker = goalMarkers.min { m1, m2 -> Bool in
             guard let p1: CGPoint = proxy.position(for: (m1.date, m1.cumulativeSavingsNeeded)), let p2: CGPoint = proxy.position(for: (m2.date, m2.cumulativeSavingsNeeded)) else { return false }
             return distance(plotLoc, p1) < distance(plotLoc, p2)
         }
        if let marker = tappedMarker, let markerPos: CGPoint = proxy.position(for: (marker.date, marker.cumulativeSavingsNeeded)), distance(plotLoc, markerPos) < 25 {
            selectedMarkerGoal = (selectedMarkerGoal?.id == marker.goal.id) ? nil : marker.goal; selectedDate = nil; selectedProjectedSavings = nil; Haptics.shared.mediumImpact(); return
        }
        if let date: Date = proxy.value(atX: plotLoc.x) { // Fallback to line selection
            let closest = chartData.min(by: { abs($0.date.timeIntervalSince(date)) < abs($1.date.timeIntervalSince(date)) })
            if let pt = closest { selectedDate = pt.date; selectedProjectedSavings = pt.projectedSavings; selectedMarkerGoal = nil; Haptics.shared.lightImpact() }
        } else { clearSelection() }
    }
    private func clearSelection() { selectedDate = nil; selectedProjectedSavings = nil; selectedMarkerGoal = nil }
    private func distance(_ a: CGPoint, _ b: CGPoint) -> CGFloat { sqrt(pow(a.x - b.x, 2) + pow(a.y - b.y, 2)) }
    private func formatYAxisAmount(_ amount: Double) -> String { if amount == 0 { return "0" }; let k = amount / 1000, m = amount / 1_000_000; if m >= 1 { return "\(Int(m))M" } else if k >= 1 { return "\(Int(k))k" } else { return "\(Int(amount))" } }
}
EOF

# --- Views/Finances ---
cat << 'EOF' > "$PROJECT_NAME/Views/Finances/FinancesView.swift"
import SwiftUI

struct FinancesView: View {
    @EnvironmentObject var userDataManager: UserDataManager
    @State private var showingAddGoalSheet = false
    @State private var editMode: EditMode = .inactive

    var body: some View {
        NavigationStack {
            List {
                Section {
                     IncomeExpenseSlider(label: "Monthly Salary", value: $userDataManager.financialMetrics.monthlySalary, range: 0...max(20000, userDataManager.financialMetrics.monthlySalary * 2), step: 100, color: Color.theme.accentTeal, icon: "banknote.fill")
                } header: { Text("Income").modifier(SectionHeaderModifier()) }
                .listRowInsets(EdgeInsets(top: 15, leading: 20, bottom: 15, trailing: 20)).listRowBackground(Color.theme.surface).listRowSeparator(.hidden)

                Section {
                     IncomeExpenseSlider(label: "Total Expenses", value: $userDataManager.financialMetrics.monthlyExpenses, range: 0...max(15000, userDataManager.financialMetrics.monthlyExpenses * 2), step: 50, color: Color.theme.accentGold, icon: "cart.fill")
                } header: { Text("Expenses").modifier(SectionHeaderModifier()) }
                 .listRowInsets(EdgeInsets(top: 15, leading: 20, bottom: 15, trailing: 20)).listRowBackground(Color.theme.surface).listRowSeparator(.hidden)

                Section {
                    if userDataManager.goals.isEmpty {
                         Text("Tap '+' to add your first goal.").cleanBodyStyle().padding(.vertical, 20).frame(maxWidth: .infinity, alignment: .center).listRowBackground(Color.theme.surface).listRowSeparator(.hidden)
                    } else {
                        ForEach($userDataManager.goals) { $goal in GoalRow(goal: $goal).listRowBackground(Color.theme.surface).listRowSeparatorTint(Color.theme.background.opacity(0.5)) }
                        .onDelete(perform: editMode.isEditing ? deleteGoal : nil)
                        .onMove(perform: editMode.isEditing ? moveGoal : nil)
                    }
                } header: {
                     HStack { Text("Goals").modifier(SectionHeaderModifier()); Spacer()
                         Button { showingAddGoalSheet = true; Haptics.shared.lightImpact() } label: { Image(systemName: "plus.circle.fill").font(.title2).foregroundColor(Color.theme.accentGold) }
                     }.padding(.bottom, 5)
                }

                 Section {
                      HStack { Label("Monthly Savings", systemImage: "chart.line.uptrend.xyaxis").foregroundColor(Color.theme.primaryText); Spacer(); Text(userDataManager.financialMetrics.monthlySavings.formattedCurrency()).fontWeight(.semibold).foregroundColor(summaryColor(for: userDataManager.financialMetrics.monthlySavings)) }
                      HStack { Label("Savings Rate", systemImage: "percent").foregroundColor(Color.theme.primaryText); Spacer(); Text(userDataManager.financialMetrics.savingsRate.formattedPercentage()).fontWeight(.semibold).foregroundColor(Color.theme.accentTeal) }
                 } header: { Text("Summary").modifier(SectionHeaderModifier()) }
                 .listRowInsets(EdgeInsets(top: 15, leading: 20, bottom: 15, trailing: 20)).listRowBackground(Color.theme.surface).listRowSeparator(.hidden)
            }
            .listStyle(.insetGrouped).background(Color.theme.background.ignoresSafeArea()).scrollContentBackground(.hidden)
            .navigationTitle("Finances").toolbar { ToolbarItemGroup(placement: .navigationBarTrailing) { EditButton().tint(Color.theme.accentTeal) } }
            .environment(\.editMode, $editMode)
            .sheet(isPresented: $showingAddGoalSheet) { AddGoalView().environmentObject(userDataManager) }
        }
    }

    private func deleteGoal(at offsets: IndexSet) { userDataManager.deleteGoals(at: offsets); Haptics.shared.mediumImpact() }
    private func moveGoal(from src: IndexSet, to dest: Int) { userDataManager.moveGoals(from: src, to: dest); Haptics.shared.lightImpact() }
    private func summaryColor(for val: Double) -> Color { val > 0 ? Color.theme.accentTeal : (val == 0 ? .orange : .red) }
}

struct SectionHeaderModifier: ViewModifier { func body(content: Content) -> some View { content.font(.headline).fontWeight(.semibold).foregroundColor(Color.theme.primaryText.opacity(0.8)).textCase(nil) } }

struct IncomeExpenseSlider: View {
    let label: String; @Binding var value: Double; let range: ClosedRange<Double>; let step: Double; let color: Color; let icon: String
    @State private var isEditing = false; @EnvironmentObject var userDataManager: UserDataManager
    @StateObject private var debouncer = Debouncer(delay: 0.3)

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                 Label(label, systemImage: icon).foregroundColor(Color.theme.primaryText).font(.headline)
                 Spacer(); Text(value.formattedCurrency()).font(.system(size: 18, weight: .semibold)).foregroundColor(color)
                     .contentTransition(.numericText(countsDown: value < previousValue)).animation(.spring(response: 0.3, dampingFraction: 0.7), value: value)
            }
            Slider(value: $value, in: range, step: step, onEditingChanged: { editing in withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) { isEditing = editing }; if !editing { Haptics.shared.lightImpact(); debouncer.cancel(); userDataManager.objectWillChange.send() } else { Haptics.shared.lightImpact() } })
            .accentColor(color).scaleEffect(isEditing ? 1.01 : 1.0, anchor: .center)
            .onChange(of: value) { _ in if isEditing { debouncer.debounce { /* Save handled by binding */ } } }
        }
    }
    private var previousValue: Double { (label == "Monthly Salary") ? userDataManager.financialMetrics.monthlySalary : userDataManager.financialMetrics.monthlyExpenses }
}

struct GoalRow: View {
     @Binding var goal: Goal; @State private var showingEditSheet = false; @EnvironmentObject var userDataManager: UserDataManager
     var body: some View {
         HStack(spacing: 15) {
             VStack(alignment: .leading, spacing: 6) { Text(goal.title).highlightedBodyStyle().lineLimit(1); Text("Target: \(goal.targetAmount.formattedCurrency())").captionStyle().lineLimit(1) }
             Spacer()
             VStack(alignment: .trailing, spacing: 6) {
                 ProgressView(value: goal.progress).progressViewStyle(LinearProgressViewStyle(tint: Color.theme.accentGold)).scaleEffect(x: 1, y: 1.8).animation(.easeInOut, value: goal.progress).frame(maxWidth: 100)
                 HStack(spacing: 8) { Text("\(Int(goal.progress * 100))%").font(.subheadline).fontWeight(.bold).foregroundColor(Color.theme.accentGold).animation(.none, value: goal.progress); PriorityBadge(priority: goal.priority, fontSize: .caption) }
             }.frame(width: 120, alignment: .trailing)
         }
         .padding(.vertical, 12).contentShape(Rectangle()).onTapGesture { showingEditSheet = true; Haptics.shared.lightImpact() }
         .sheet(isPresented: $showingEditSheet) { EditGoalView(goal: $goal).environmentObject(userDataManager) }
    }
}

struct PriorityBadge: View { let priority: Priority; var fontSize: Font = .caption2; var body: some View { Text(priority.rawValue).font(fontSize).fontWeight(.bold).padding(.horizontal, 8).padding(.vertical, 4).background(priority.color.opacity(0.2)).foregroundColor(priority.color).clipShape(Capsule()) } }

struct AddGoalView: View { // Simplified AddGoalView
    @EnvironmentObject var dataManager: UserDataManager; @Environment(\.dismiss) var dismiss
    @State private var selTitle: String = Goal.predefinedTitles.first ?? "New Goal"; @State private var customTitle: String = ""; @State private var isCustomActive = false
    @State private var amountStr: String = ""; @State private var priority: Priority = .medium; @FocusState private var isAmountFocused: Bool
    let options = Goal.predefinedTitles + ["Custom..."]
    var amount: Double { Double(amountStr.filter("0123456789".contains)) ?? 0 }
    var isValid: Bool { let title = isCustomActive ? customTitle : selTitle; return !title.isEmpty && title != "Custom..." && amount > 0 }

    var body: some View {
        NavigationView {
            Form { Section("Goal") {
                Picker("Type", selection: $selTitle) { ForEach(options, id: \.self) { Text($0).tag($0) } }
                    .onChange(of: selTitle) { withAnimation { isCustomActive = ($0 == "Custom...") }; if isCustomActive { customTitle = "" } }
                if isCustomActive { TextField("Custom Title", text: $customTitle).autocapitalization(.words).transition(.opacity.combined(with: .offset(y: -10))) }
                HStack { Text("Target (\(Locale.current.currencySymbol ?? "$"))"); Spacer(); TextField("e.g., 5000", text: $amountStr).keyboardType(.numberPad).multilineTextAlignment(.trailing).focused($isAmountFocused).foregroundColor(Color.theme.accentGold).submitLabel(.done) }
                Picker("Priority", selection: $priority) { ForEach(Priority.allCases) { p in HStack{ Circle().fill(p.color).frame(width:8,height:8); Text(p.rawValue) }.tag(p) } }.pickerStyle(.segmented)
            }.listRowBackground(Color.theme.surface).listRowSeparatorTint(Color.theme.background.opacity(0.5)) }
            .background(Color.theme.background.ignoresSafeArea()).scrollContentBackground(.hidden).navigationTitle("Add Goal").navigationBarTitleDisplayMode(.inline)
            .toolbar { ToolbarItemGroup(placement: .keyboard) { Spacer(); Button("Done") { isAmountFocused = false }.tint(Color.theme.accentGold) }
                       ToolbarItem(placement: .navigationBarLeading) { Button("Cancel") { dismiss() }.foregroundColor(Color.theme.accentTeal) }
                       ToolbarItem(placement: .navigationBarTrailing) { Button("Add") { addAndDismiss() }.bold().foregroundColor(isValid ? Color.theme.accentGold : .gray).disabled(!isValid) } }
            .preferredColorScheme(.dark).onAppear { isCustomActive = (selTitle == "Custom...") }
        }
    }
    func addAndDismiss() { guard isValid else { return }; let title = isCustomActive ? customTitle : selTitle; dataManager.addGoal(title: title, targetAmount: amount, priority: priority); Haptics.shared.success(); dismiss() }
}

struct EditGoalView: View { // Simplified EditGoalView
    @Binding var goal: Goal; @EnvironmentObject var dataManager: UserDataManager; @Environment(\.dismiss) var dismiss
    @State private var title: String; @State private var targetStr: String; @State private var currentStr: String; @State private var priority: Priority
    @FocusState private var isAmountFocused: Bool; @State private var showingDeleteAlert = false
    var targetAmt: Double { Double(targetStr.filter("0123456789".contains)) ?? 0 }
    var currentAmt: Double { Double(currentStr.filter("0123456789".contains)) ?? 0 }
    var isValid: Bool { !title.isEmpty && targetAmt > 0 && currentAmt >= 0 && currentAmt <= targetAmt }

    init(goal: Binding<Goal>) {
        self._goal = goal; _title = State(initialValue: goal.wrappedValue.title); _targetStr = State(initialValue: String(format: "%.0f", goal.wrappedValue.targetAmount))
        _currentStr = State(initialValue: String(format: "%.0f", goal.wrappedValue.currentAmount)); _priority = State(initialValue: goal.wrappedValue.priority)
    }

    var body: some View {
        NavigationView {
            Form { Section("Goal") {
                TextField("Title", text: $title).autocapitalization(.words).submitLabel(.next)
                HStack { Text("Target"); Spacer(); TextField("Amt", text: $targetStr).keyboardType(.numberPad).multilineTextAlignment(.trailing).focused($isAmountFocused).foregroundColor(Color.theme.accentGold).submitLabel(.next) }
                HStack { VStack(alignment:.leading, spacing:2){ Text("Saved"); if currentAmt>targetAmt { Text("Over target").font(.caption2).foregroundColor(.red).transition(.opacity) }}; Spacer(); TextField("Amt", text: $currentStr).keyboardType(.numberPad).multilineTextAlignment(.trailing).focused($isAmountFocused).foregroundColor(currentAmt <= targetAmt ? Color.theme.accentTeal : .red).submitLabel(.done) }.animation(.easeInOut(duration:0.2), value: currentAmt>targetAmt)
                Picker("Priority", selection: $priority) { ForEach(Priority.allCases) { p in HStack{ Circle().fill(p.color).frame(width:8,height:8); Text(p.rawValue) }.tag(p) } }.pickerStyle(.segmented)
            }.listRowBackground(Color.theme.surface).listRowSeparatorTint(Color.theme.background.opacity(0.5))
            Section { Button(role: .destructive) { showingDeleteAlert = true; Haptics.shared.warning() } label: { Label("Delete Goal", systemImage: "trash.fill").frame(maxWidth: .infinity, alignment: .center).foregroundColor(.red) } }.listRowBackground(Color.theme.surface).listRowSeparator(.hidden) }
            .background(Color.theme.background.ignoresSafeArea()).scrollContentBackground(.hidden).navigationTitle("Edit Goal").navigationBarTitleDisplayMode(.inline)
            .toolbar { ToolbarItemGroup(placement: .keyboard) { Spacer(); Button("Done") { isAmountFocused = false }.tint(Color.theme.accentGold) }
                       ToolbarItem(placement: .navigationBarLeading) { Button("Cancel") { dismiss() }.foregroundColor(Color.theme.accentTeal) }
                       ToolbarItem(placement: .navigationBarTrailing) { Button("Save") { saveAndDismiss() }.bold().foregroundColor(isValid ? Color.theme.accentGold : .gray).disabled(!isValid) } }
            .preferredColorScheme(.dark)
            .alert("Delete Goal?", isPresented: $showingDeleteAlert) { Button("Cancel", role:.cancel){}; Button("Delete", role:.destructive){ deleteAndDismiss() } } message: { Text("Delete \"\(goal.title)\"?") }
        }
    }
    func saveAndDismiss() { guard isValid else{return}; var updated=goal; updated.title=title; updated.targetAmount=targetAmt; updated.currentAmount=min(currentAmt,targetAmt); updated.priority=priority; goal=updated; Haptics.shared.success(); dismiss() }
    func deleteAndDismiss() { dataManager.deleteGoal(goal); Haptics.shared.heavyImpact(); dismiss() }
}

// Debouncer Utility
class Debouncer: ObservableObject {
    private var item: DispatchWorkItem?; private let delay: TimeInterval
    init(delay: TimeInterval) { self.delay = delay }
    func debounce(action: @escaping () -> Void) { item?.cancel(); let newItem = DispatchWorkItem(block: action); item = newItem; DispatchQueue.main.asyncAfter(deadline: .now() + delay, execute: newItem) }
    func cancel() { item?.cancel(); item = nil }
}
EOF

# --- Views (Root Level) ---
cat << 'EOF' > "$PROJECT_NAME/Views/MainTabView.swift"
import SwiftUI
import UIKit // For appearance

struct MainTabView: View {
    @State private var selectedTab: Tab = .dashboard
    @EnvironmentObject var userDataManager: UserDataManager

    enum Tab: Hashable { case dashboard, finances }

    init() { configureTabBarAppearance() }

    var body: some View {
        TabView(selection: $selectedTab) {
            DashboardView().tabItem { Label("Dashboard", systemImage: selectedTab == .dashboard ? "chart.pie.fill" : "chart.pie") }.tag(Tab.dashboard)
            FinancesView().tabItem { Label("Finances", systemImage: selectedTab == .finances ? "dollarsign.circle.fill" : "dollarsign.circle") }.tag(Tab.finances)
        }
        .onChange(of: selectedTab) { _ in Haptics.shared.lightImpact() }
    }

    private func configureTabBarAppearance() {
         let appearance = UITabBarAppearance()
         appearance.configureWithOpaqueBackground()
         appearance.backgroundColor = UIColor(Color.theme.surface)
         appearance.shadowColor = UIColor(Color.theme.background) // Line color
         let itemAppearance = UITabBarItemAppearance()
         itemAppearance.normal.iconColor = UIColor(Color.theme.secondaryText).withAlphaComponent(0.6)
         itemAppearance.normal.titleTextAttributes = [.foregroundColor: UIColor(Color.theme.secondaryText).withAlphaComponent(0.6), .font: UIFont.systemFont(ofSize: 10)]
         itemAppearance.selected.iconColor = UIColor(Color.theme.accentGold)
         itemAppearance.selected.titleTextAttributes = [.foregroundColor: UIColor(Color.theme.accentGold), .font: UIFont.systemFont(ofSize: 10, weight: .medium)]
         appearance.stackedLayoutAppearance = itemAppearance
         appearance.inlineLayoutAppearance = itemAppearance
         appearance.compactInlineLayoutAppearance = itemAppearance
         UITabBar.appearance().standardAppearance = appearance
         UITabBar.appearance().scrollEdgeAppearance = appearance
    }
}

// Settings View (Modal) - Simplified
struct SettingsView: View {
     @EnvironmentObject var userDataManager: UserDataManager; @Environment(\.dismiss) var dismiss; @State private var showingResetAlert = false
     var body: some View {
          NavigationView {
              Form {
                  Section("Account") { Button(role: .destructive) { handleLogout() } label: { Label("Log Out", systemImage: "rectangle.portrait.and.arrow.right").foregroundColor(.orange).frame(maxWidth: .infinity, alignment: .center) } }.listRowBackground(Color.theme.surface).listRowSeparatorTint(Color.theme.background.opacity(0.5))
                  Section("Data") { Button(role: .destructive) { showingResetAlert = true; Haptics.shared.warning() } label: { Label("Reset All App Data", systemImage: "trash.fill").foregroundColor(.red).frame(maxWidth: .infinity, alignment: .center) } }.listRowBackground(Color.theme.surface).listRowSeparator(.hidden)
              }
              .background(Color.theme.background.ignoresSafeArea()).scrollContentBackground(.hidden).navigationTitle("Settings").navigationBarTitleDisplayMode(.inline)
              .toolbar { ToolbarItem(placement: .navigationBarTrailing) { Button("Done") { dismiss(); Haptics.shared.lightImpact() }.foregroundColor(Color.theme.accentGold) } }
              .alert("Reset All Data?", isPresented: $showingResetAlert) { Button("Cancel",role:.cancel){}; Button("Reset",role:.destructive){ handleReset() } } message: { Text("This cannot be undone.") }
              .preferredColorScheme(.dark)
          }
     }
    func handleLogout() { Haptics.shared.mediumImpact(); userDataManager.isAuthenticated = false; dismiss() }
    func handleReset() { userDataManager.resetData(); Haptics.shared.heavyImpact(); /* dismiss() ? */ }
}
EOF

echo "      Created Swift files."

# --- Create Asset Catalog ---
echo "   Creating Asset Catalog structure..."
mkdir "$PROJECT_NAME/Assets.xcassets"
mkdir "$PROJECT_NAME/Assets.xcassets/AccentColor.colorset"
mkdir "$PROJECT_NAME/Assets.xcassets/AppIcon.appiconset"
mkdir "$PROJECT_NAME/Assets.xcassets/BackgroundColor.colorset"
mkdir "$PROJECT_NAME/Assets.xcassets/SurfaceColor.colorset"
mkdir "$PROJECT_NAME/Assets.xcassets/PrimaryTextColor.colorset"
mkdir "$PROJECT_NAME/Assets.xcassets/SecondaryTextColor.colorset"
mkdir "$PROJECT_NAME/Assets.xcassets/AccentGoldColor.colorset"
mkdir "$PROJECT_NAME/Assets.xcassets/AccentNavyColor.colorset"
mkdir "$PROJECT_NAME/Assets.xcassets/AccentTealColor.colorset"

# --- Create Asset Catalog JSON Files ---
echo "      Creating Contents.json for assets..."

# Root Assets Contents.json
cat << 'EOF' > "$PROJECT_NAME/Assets.xcassets/Contents.json"
{ "info" : { "author" : "xcode", "version" : 1 } }
EOF

# AccentColor Contents.json (Default, can be overridden)
cat << 'EOF' > "$PROJECT_NAME/Assets.xcassets/AccentColor.colorset/Contents.json"
{ "info" : { "author" : "xcode", "version" : 1 }, "colors" : [ { "idiom" : "universal" } ] }
EOF

# AppIcon Contents.json (References needed image sizes)
cat << 'EOF' > "$PROJECT_NAME/Assets.xcassets/AppIcon.appiconset/Contents.json"
{
  "images" : [
    { "idiom" : "iphone", "scale" : "2x", "size" : "20x20" }, { "idiom" : "iphone", "scale" : "3x", "size" : "20x20" },
    { "idiom" : "iphone", "scale" : "2x", "size" : "29x29" }, { "idiom" : "iphone", "scale" : "3x", "size" : "29x29" },
    { "idiom" : "iphone", "scale" : "2x", "size" : "40x40" }, { "idiom" : "iphone", "scale" : "3x", "size" : "40x40" },
    { "idiom" : "iphone", "scale" : "2x", "size" : "60x60" }, { "idiom" : "iphone", "scale" : "3x", "size" : "60x60" },
    { "idiom" : "ipad", "scale" : "1x", "size" : "20x20" }, { "idiom" : "ipad", "scale" : "2x", "size" : "20x20" },
    { "idiom" : "ipad", "scale" : "1x", "size" : "29x29" }, { "idiom" : "ipad", "scale" : "2x", "size" : "29x29" },
    { "idiom" : "ipad", "scale" : "1x", "size" : "40x40" }, { "idiom" : "ipad", "scale" : "2x", "size" : "40x40" },
    { "idiom" : "ipad", "scale" : "1x", "size" : "76x76" }, { "idiom" : "ipad", "scale" : "2x", "size" : "76x76" },
    { "idiom" : "ipad", "scale" : "2x", "size" : "83.5x83.5" },
    { "idiom" : "ios-marketing", "scale" : "1x", "size" : "1024x1024" }
  ],
  "info" : { "author" : "xcode", "version" : 1 }
}
EOF
# Note: Actual icon image files are not included in this script. Placeholder references are generated.

# Color Set Contents.json Template Function
create_colorset_json() {
  local colorset_path="$1"
  local hex_color="$2"
  cat << EOF > "$colorset_path/Contents.json"
{
  "colors" : [
    {
      "appearances" : [ { "appearance" : "luminosity", "value" : "dark" } ],
      "color" : { "color-space" : "srgb", "components" : { "alpha" : "1.000", "blue" : "0x${hex_color:5:2}", "green" : "0x${hex_color:3:2}", "red" : "0x${hex_color:1:2}" } },
      "idiom" : "universal"
    }
    // Optional: Add light mode color here if needed
    // {
    //   "color" : { ... light mode components ... },
    //   "idiom" : "universal"
    // }
  ],
  "info" : { "author" : "xcode", "version" : 1 }
}
EOF
}

# Create JSON for each color
create_colorset_json "$PROJECT_NAME/Assets.xcassets/BackgroundColor.colorset"    "1A1D2E"
create_colorset_json "$PROJECT_NAME/Assets.xcassets/SurfaceColor.colorset"       "2A2F45"
create_colorset_json "$PROJECT_NAME/Assets.xcassets/PrimaryTextColor.colorset"   "F0F0F5"
create_colorset_json "$PROJECT_NAME/Assets.xcassets/SecondaryTextColor.colorset" "A0A5B9"
create_colorset_json "$PROJECT_NAME/Assets.xcassets/AccentGoldColor.colorset"    "D4AF37"
create_colorset_json "$PROJECT_NAME/Assets.xcassets/AccentNavyColor.colorset"    "5870A3" # Adjusted Navy
create_colorset_json "$PROJECT_NAME/Assets.xcassets/AccentTealColor.colorset"    "48D1CC"

echo "      Created Asset Catalog JSON files."

# --- Create Preview Content Assets ---
echo "   Creating Preview Content..."
mkdir "$PROJECT_NAME/Preview Content"
mkdir "$PROJECT_NAME/Preview Content/Preview Assets.xcassets"
cat << 'EOF' > "$PROJECT_NAME/Preview Content/Preview Assets.xcassets/Contents.json"
{ "info" : { "author" : "xcode", "version" : 1 } }
EOF

# --- Create Info.plist ---
echo "   Creating Info.plist..."
cat << EOF > "$PROJECT_NAME/Info.plist"
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>CFBundleIdentifier</key>
	<string>\$(PRODUCT_BUNDLE_IDENTIFIER)</string>
	<key>CFBundleName</key>
	<string>\$(PRODUCT_NAME)</string>
	<key>CFBundleVersion</key>
	<string>1</string>
	<key>CFBundleExecutable</key>
	<string>\$(EXECUTABLE_NAME)</string>
	<key>CFBundlePackageType</key>
	<string>\$(PRODUCT_BUNDLE_PACKAGE_TYPE)</string>
	<key>CFBundleShortVersionString</key>
	<string>1.0</string>
	<key>UIApplicationSceneManifest</key>
	<dict>
		<key>UIApplicationSupportsMultipleScenes</key>
		<false/>
		<key>UISceneConfigurations</key>
		<dict/>
	</dict>
	<key>UILaunchScreen</key>
	<dict/>
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

# --- Final Steps ---
echo ""
echo "✅ Kabala project generation complete!"
echo ""
echo "➡️ Next Steps:"
echo "1. Open '$PROJECT_NAME.xcodeproj' in Xcode."
echo "2. Select an iOS Simulator (iOS $TARGET_IOS_VERSION+)."
echo "3. Click the Run button (▶︎)."
echo "4. (For Device Builds Only): Go to Project Settings -> Target '$PROJECT_NAME' -> Signing & Capabilities and select your Development Team."
echo ""
echo "ℹ️ Note: The App Icon is currently empty. Add icon images to '$PROJECT_NAME/Assets.xcassets/AppIcon.appiconset' in Xcode."

exit 0
