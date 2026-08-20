export type Language = "en" | "pt-BR";

export interface Translations {
  // Titlebar Nav
  nav_boost: string;
  nav_tweaks: string;
  nav_logs: string;
  nav_cloud: string;
  nav_social: string;
  nav_discover: string;
  nav_settings: string;
  admin_active: string;
  admin_user: string;
  minimize: string;
  maximize: string;
  close: string;

  // Main Dashboard
  boost_now: string;
  boosting: string;
  ready_to_optimize: string;
  system_ready: string;
  system_optimized: string;
  optimizations_queued: string;
  dashboard_subtitle: string;

  // Tweak Categories
  cat_all: string;
  cat_telemetry: string;
  cat_gaming: string;
  cat_power: string;
  cat_debloat: string;
  cat_cleanup: string;
  save_profile_cloud: string;

  // Settings View Sections & Controls
  settings_title: string;
  settings_subtitle: string;
  app_language: string;
  app_language_desc: string;
  show_profile_island: string;
  show_profile_island_desc: string;
  app_lock: string;
  app_lock_desc: string;
  btn_set_lock_password: string;
  app_lock_protected: string;
  app_lock_placeholder: string;
  app_lock_incorrect: string;
  app_lock_unlock: string;
  app_lock_verifying: string;
  check_for_updates: string;
  check_for_updates_desc: string;
  btn_check_updates: string;
  minimize_to_tray: string;
  minimize_to_tray_desc: string;
  visual_effects: string;
  parallax_stars: string;
  parallax_stars_desc: string;
  system_protection: string;
  auto_restore_point: string;
  auto_restore_point_desc: string;
  reset_default: string;

  // Console Logs
  console_title: string;
  console_subtitle: string;
  clear_logs: string;
  filter_all: string;
  filter_info: string;
  filter_success: string;
  filter_error: string;

  // Auth & Profile
  sign_in: string;
  sign_up: string;
  account_created: string;
  username_email: string;
  gaming_username: string;
  email_address: string;
  password: string;
  confirm_password: string;
  passwords_mismatch: string;
  create_account: string;
  generate_nick: string;
  change_avatar: string;
  upload_image: string;
  change_password: string;
  current_password: string;
  new_password: string;
  update_username: string;

  // Social & Cloud
  cloud_profiles_title: string;
  cloud_profiles_subtitle: string;
  shared_with_me: string;
  my_cloud_configs: string;
  friends_squad: string;
  apply_profile: string;
  sync_and_apply: string;
  share: string;
  delete: string;
  save_profile: string;
  profile_title_prompt: string;
  enter_username: string;
  send_request: string;
  accept: string;

  // Dynamic Tweak Name & Description Translations
  tweak_mouse_accel_name: string;
  tweak_mouse_accel_desc: string;
  tweak_mouse_hover_name: string;
  tweak_mouse_hover_desc: string;
  tweak_hags_name: string;
  tweak_hags_desc: string;
  tweak_mmcss_name: string;
  tweak_mmcss_desc: string;
  tweak_gamedvr_name: string;
  tweak_gamedvr_desc: string;
  tweak_nagle_name: string;
  tweak_nagle_desc: string;
  tweak_p2p_name: string;
  tweak_p2p_desc: string;
  tweak_power_name: string;
  tweak_power_desc: string;
  tweak_corepark_name: string;
  tweak_corepark_desc: string;
  tweak_hibernation_name: string;
  tweak_hibernation_desc: string;
  tweak_bgapps_name: string;
  tweak_bgapps_desc: string;
  tweak_telemetry_name: string;
  tweak_telemetry_desc: string;
  tweak_diagkeys_name: string;
  tweak_diagkeys_desc: string;
  tweak_teletasks_name: string;
  tweak_teletasks_desc: string;
  tweak_gamemode_name: string;
  tweak_gamemode_desc: string;
  tweak_throttling_name: string;
  tweak_throttling_desc: string;
  tweak_bing_name: string;
  tweak_bing_desc: string;
  tweak_widgets_name: string;
  tweak_widgets_desc: string;
  tweak_tempfiles_name: string;
  tweak_tempfiles_desc: string;
  tweak_dnsflush_name: string;
  tweak_dnsflush_desc: string;
  tweak_location_name: string;
  tweak_location_desc: string;
  tweak_advertising_name: string;
  tweak_advertising_desc: string;
  tweak_wer_name: string;
  tweak_wer_desc: string;
  tweak_cortana_name: string;
  tweak_cortana_desc: string;
  tweak_tips_name: string;
  tweak_tips_desc: string;
  tweak_eee_name: string;
  tweak_eee_desc: string;
  tweak_usb_name: string;
  tweak_usb_desc: string;
  tweak_largecache_name: string;
  tweak_largecache_desc: string;
  tweak_wpbt_name: string;
  tweak_wpbt_desc: string;
  tweak_devmeta_name: string;
  tweak_devmeta_desc: string;
  tweak_activity_name: string;
  tweak_activity_desc: string;
  tweak_consumer_name: string;
  tweak_consumer_desc: string;
  tweak_endtask_name: string;
  tweak_endtask_desc: string;
  tweak_storesearch_name: string;
  tweak_storesearch_desc: string;
  tweak_notifications_name: string;
  tweak_notifications_desc: string;
  tweak_classicmenu_name: string;
  tweak_classicmenu_desc: string;
  tweak_homegallery_name: string;
  tweak_homegallery_desc: string;
  tweak_edgedebloat_name: string;
  tweak_edgedebloat_desc: string;
  tweak_fso_name: string;
  tweak_fso_desc: string;
  tweak_ipv4_name: string;
  tweak_ipv4_desc: string;
  tweak_teredo_name: string;
  tweak_teredo_desc: string;
  tweak_services_name: string;
  tweak_services_desc: string;
  tweak_vfx_name: string;
  tweak_vfx_desc: string;
  tweak_folderdiscover_name: string;
  tweak_folderdiscover_desc: string;
  tweak_storagesense_name: string;
  tweak_storagesense_desc: string;
  tweak_dismclean_name: string;
  tweak_dismclean_desc: string;
  tweak_darkmode_name: string;
  tweak_darkmode_desc: string;
  tweak_extensions_name: string;
  tweak_extensions_desc: string;
  tweak_hiddenfiles_name: string;
  tweak_hiddenfiles_desc: string;
  tweak_battery_name: string;
  tweak_battery_desc: string;
  tweak_verboselogon_name: string;
  tweak_verboselogon_desc: string;
  tweak_bsod_name: string;
  tweak_bsod_desc: string;
  tweak_onedrive_name: string;
  tweak_onedrive_desc: string;
  cat_safety: string;
  cat_preferences: string;
  advanced_badge: string;
  advanced_confirm: string;

  // Connection / Offline State
  offline_banner_title: string;
  offline_banner_message: string;
  offline_banner_retry: string;
  offline_banner_checking: string;
  offline_mode_label: string;

  // Search & Discovery
  search_placeholder_tweaks: string;
  search_placeholder_cloud: string;
  search_placeholder_shared: string;
  search_placeholder_friends_filter: string;
  search_placeholder_find_players: string;
  search_placeholder_console: string;
  search_placeholder_discover: string;
  search_placeholder_scripts: string;
  search_no_results: string;
  find_players_title: string;
  user_results_title: string;

  // Reversible Tweak Engine
  undo_tweak: string;
  undo_tweak_tooltip: string;
  revert_all: string;
  revert_all_tooltip: string;

  // Utilities Hub
  nav_utilities: string;
  util_title: string;
  util_subtitle: string;
  util_dns: string;
  util_updates: string;
  util_fixes: string;
  util_features: string;
  util_apps: string;
  dns_current: string;
  dns_refresh: string;
  dns_active: string;
  dns_apply: string;
  update_default: string;
  update_default_desc: string;
  update_security: string;
  update_security_desc: string;
  update_disable: string;
  update_disable_desc: string;
  update_apply: string;
  util_confirm_disable_updates: string;
  fix_network_reset: string;
  fix_network_reset_desc: string;
  fix_wu_reset: string;
  fix_wu_reset_desc: string;
  fix_dism_scan: string;
  fix_dism_scan_desc: string;
  fix_ntp: string;
  fix_ntp_desc: string;
  fix_explorer: string;
  fix_explorer_desc: string;
  fix_icon_cache: string;
  fix_icon_cache_desc: string;
  fix_run: string;
  fix_running: string;
  export_profile: string;
  import_profile: string;
  profile_exported_toast: string;
  profile_imported_toast: string;
  feature_dotnet: string;
  feature_wsl: string;
  feature_hyperv: string;
  feature_legacy_media: string;
  feature_sandbox: string;
  feature_nfs: string;
  feature_regbackup: string;
  feature_enable: string;
  feature_disable: string;
  feature_reboot_notice: string;
  apps_search_placeholder: string;
  apps_search_btn: string;
  apps_upgrade_all: string;
  apps_upgrade_all_tooltip: string;
  apps_curated: string;
  apps_install: string;

  // Presets Marketplace & Sync
  presets_tab_title: string;
  presets_tab_subtitle: string;
  presets_publish: string;
  presets_publish_desc: string;
  presets_publish_btn: string;
  presets_publishing: string;
  preset_name_ph: string;
  preset_desc_ph: string;
  preset_tags_ph: string;
  preset_contains_advanced: string;
  preset_safe_only: string;
  preset_safe_badge: string;
  preset_remix: string;
  preset_remix_of: string;
  preset_apply: string;
  presets_tweak_count: string;
  presets_empty: string;
  presets_empty_hint: string;
  presets_loading: string;
  presence_online: string;
  presence_offline: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    nav_boost: "One-Click Boost",
    nav_tweaks: "Tweak Customization",
    nav_logs: "Execution Console Logs",
    nav_cloud: "Cloud Profiles & Sync",
    nav_social: "Social & Friends",
    nav_discover: "Discover Hub",
    nav_settings: "Settings & Security",
    admin_active: "ADMIN",
    admin_user: "USER",
    minimize: "Minimize",
    maximize: "Maximize",
    close: "Close",

    boost_now: "BOOST",
    boosting: "BOOSTING...",
    ready_to_optimize: "Ready to optimize Windows",
    system_ready: "System Ready",
    system_optimized: "System Optimized",
    optimizations_queued: "optimizations queued",
    dashboard_subtitle: "One-Click Windows Debloater & Gaming Optimizer",

    cat_all: "ALL TWEAKS",
    cat_telemetry: "TELEMETRY",
    cat_gaming: "GAMING",
    cat_power: "POWER",
    cat_debloat: "DEBLOAT",
    cat_cleanup: "CLEANUP",
    save_profile_cloud: "Save Profile to Cloud",

    settings_title: "1boost Preferences & Security",
    settings_subtitle: "Configure app password lock, language, visual effects, system tray, and updates.",

    app_language: "Application Language",
    app_language_desc: "Choose between English and natural Brazilian Portuguese (PT-BR).",
    show_profile_island: "Show Profile Island on Main Page",
    show_profile_island_desc: "Display user avatar and handle shortcut pill at the bottom of the main dashboard.",
    app_lock: "Lock App with Password",
    app_lock_desc: "Require an encrypted security password to launch and access 1boost.",
    btn_set_lock_password: "Set Security Password",
    app_lock_protected: "1boost App Protected",
    app_lock_placeholder: "Enter App Password to Unlock...",
    app_lock_incorrect: "Incorrect password. Please try again.",
    app_lock_unlock: "UNLOCK 1BOOST",
    app_lock_verifying: "Verifying...",
    check_for_updates: "Automatic GitHub Updates",
    check_for_updates_desc: "Check for new releases directly from GitHub.",
    btn_check_updates: "Check for Updates",
    minimize_to_tray: "Minimize to System Tray",
    minimize_to_tray_desc: "Keep 1boost running quietly in the Windows notification tray when minimized or closed.",
    visual_effects: "Visual Effects & Customization",
    parallax_stars: "Parallax Star Background",
    parallax_stars_desc: "Smooth 60fps canvas starfield animation responding to cursor movement on the main page.",
    system_protection: "System Protection & Safety",
    auto_restore_point: "Auto System Restore Point",
    auto_restore_point_desc: "Executes Checkpoint-Computer before applying PowerShell and Registry tweaks.",
    reset_default: "Reset All Tweaks to Default",

    console_title: "Execution Console Logs",
    console_subtitle: "Real-time output stream from native Windows PowerShell scripts.",
    clear_logs: "Clear Console Logs",
    filter_all: "All Logs",
    filter_info: "Info",
    filter_success: "Success",
    filter_error: "Errors",

    sign_in: "SIGN IN",
    sign_up: "SIGN UP",
    account_created: "Account created! Check your email to confirm registration.",
    username_email: "Username or Email",
    gaming_username: "Gaming Username",
    email_address: "Email Address",
    password: "Password",
    confirm_password: "Confirm Password",
    passwords_mismatch: "Passwords do not match",
    create_account: "CREATE ACCOUNT",
    generate_nick: "Generate Random Gaming Username",
    change_avatar: "Profile Avatar & Picture",
    upload_image: "Upload Image",
    change_password: "Change Password (Security Re-Authentication)",
    current_password: "Current Password (Verification)",
    new_password: "New Password",
    update_username: "Update Username",

    cloud_profiles_title: "Cloud Optimization Profiles",
    cloud_profiles_subtitle: "Save your current tweak combination to the cloud or apply a saved configuration profile with one click.",
    shared_with_me: "Shared With Me",
    my_cloud_configs: "My Cloud Configs",
    friends_squad: "Friends",
    apply_profile: "APPLY PROFILE",
    sync_and_apply: "Sync & Apply",
    share: "Share",
    delete: "Delete",
    save_profile: "Save Profile",
    profile_title_prompt: "Enter a title for this optimization profile:",
    enter_username: "Enter exact username...",
    send_request: "Send Request",
    accept: "Accept",

    tweak_mouse_accel_name: "Disable Mouse Acceleration (1:1 Raw Tracking)",
    tweak_mouse_accel_desc: "Disables Enhanced Pointer Precision for exact 1:1 pixel mouse input precision in competitive games.",
    tweak_mouse_hover_name: "Reduce Mouse Hover Response Lag",
    tweak_mouse_hover_desc: "Lowers MenuShowDelay from 400ms to 8ms for snappy menu transitions and reduced window latency.",
    tweak_hags_name: "Enable Hardware-Accelerated GPU Scheduling (HAGS)",
    tweak_hags_desc: "Passes memory management to dedicated GPU VRAM schedulers, improving 1% low FPS consistency.",
    tweak_mmcss_name: "Optimize MMCSS Gaming Priority Index",
    tweak_mmcss_desc: "Forces SystemResponsiveness to 0% and GPU Priority to 8 for maximum gaming thread scheduling.",
    tweak_gamedvr_name: "Disable Windows Game DVR & Background Recording",
    tweak_gamedvr_desc: "Turns off background Xbox screen recording and GameBar overlays to free GPU encoding resources.",
    tweak_nagle_name: "Disable Nagle's Algorithm (Zero-Latency TCP)",
    tweak_nagle_desc: "Sets TcpAckFrequency and TcpNoDelay to 1 to flush online multiplayer network packets immediately.",
    tweak_p2p_name: "Disable Delivery Optimization P2P Uploads",
    tweak_p2p_desc: "Stops Windows Update from consuming network bandwidth by uploading files to peer PCs.",
    tweak_power_name: "Unlock Ultimate Performance Power Plan",
    tweak_power_desc: "Enables hidden Windows Ultimate Performance scheme to prevent CPU core throttle under gaming load.",
    tweak_corepark_name: "Disable CPU Core Parking",
    tweak_corepark_desc: "Ensures all logical processor cores stay unparked at 100% frequency readiness.",
    tweak_hibernation_name: "Disable Hibernation File (Free RAM Space)",
    tweak_hibernation_desc: "Deletes hiberfil.sys to reclaim disk space equivalent to your total RAM size.",
    tweak_bgapps_name: "Disable Background Windows Store Apps",
    tweak_bgapps_desc: "Prevents Microsoft Store apps from running in the background and consuming RAM.",
    tweak_telemetry_name: "Disable Telemetry & DiagTrack Services",
    tweak_telemetry_desc: "Stops Connected User Experiences and Telemetry services from transmitting usage data.",
    tweak_diagkeys_name: "Strip Diagnostic & Data Collection Keys",
    tweak_diagkeys_desc: "Sets AllowTelemetry to 0 (Security mode) and disables feedback frequency prompts.",
    tweak_teletasks_name: "Disable Telemetry Scheduled Tasks",
    tweak_teletasks_desc: "Disables Application Experience, ProgramDataUpdater and CEIP scheduled tasks.",
    tweak_gamemode_name: "Enable Windows Game Mode",
    tweak_gamemode_desc: "Allocates maximum CPU and GPU resources to running games while preventing background update installs.",
    tweak_throttling_name: "Disable Power Throttling",
    tweak_throttling_desc: "Ensures background tasks and full-screen games receive full CPU instruction throughput.",
    tweak_bing_name: "Disable Bing Search in Start Menu",
    tweak_bing_desc: "Stops Start Menu web search queries and Cortana background telemetry overhead.",
    tweak_widgets_name: "Disable Windows Widgets Feed",
    tweak_widgets_desc: "Disables taskbar Widgets background news feed processes and memory consumption.",
    tweak_tempfiles_name: "Clean Temporary & Cache Files",
    tweak_tempfiles_desc: "Clears temporary user files (%TEMP%), Windows system temp and prefetch storage.",
    tweak_dnsflush_name: "Flush DNS Resolver Cache",
    tweak_dnsflush_desc: "Clears cached network domain lookup tables to refresh network routing and resolve stale IP addresses.",
    tweak_location_name: "Disable Location Tracking & Sensors",
    tweak_location_desc: "Blocks app access to your device location and disables the Location Service (lfsvc) background process.",
    tweak_advertising_name: "Disable Advertising ID Tracking",
    tweak_advertising_desc: "Turns off the unique Advertising ID Windows uses to serve targeted app ads and track activity.",
    tweak_wer_name: "Disable Windows Error Reporting (WER)",
    tweak_wer_desc: "Stops error dialogs and telemetry uploads to the Microsoft Watson crash reporting service.",
    tweak_cortana_name: "Disable Cortana & Voice Activation",
    tweak_cortana_desc: "Disables Cortana search integration, voice activation and background speech processing overhead.",
    tweak_tips_name: "Disable Windows Tips & Suggestions",
    tweak_tips_desc: "Suppresses lock screen tips, app suggestions and \"soft landing\" onboarding prompts from Microsoft.",
    tweak_eee_name: "Disable Energy-Efficient Ethernet (EEE)",
    tweak_eee_desc: "Disables Green Ethernet power-saving on all network adapters to reduce ping spikes during gameplay.",
    tweak_usb_name: "Disable USB Selective Suspend",
    tweak_usb_desc: "Prevents Windows from suspending USB ports, avoiding mouse/keyboard input lag spikes and disconnects.",
    tweak_largecache_name: "Enable Large System Cache",
    tweak_largecache_desc: "Gives the kernel file cache more RAM to work with, speeding up frequent disk reads in games and apps.",
    tweak_wpbt_name: "Disable Windows Platform Binary Table (WPBT)",
    tweak_wpbt_desc: "Blocks OEM boot-time execution of vendor software (anti-theft/drivers) that can run without your consent.",
    tweak_devmeta_name: "Prevent Device Companion App Installs",
    tweak_devmeta_desc: "Blocks automatic driver/companion software downloads when plugging in new devices.",
    tweak_activity_name: "Disable Activity History Tracking",
    tweak_activity_desc: "Erases recent docs, clipboard and run history, and stops Windows from publishing user activities.",
    tweak_consumer_name: "Disable Consumer Features & App Suggestions",
    tweak_consumer_desc: "Stops promoted app installs, Store recommendations and onboarding suggestions pushed by Microsoft.",
    tweak_endtask_name: "Enable 'End Task' on Taskbar Right-Click",
    tweak_endtask_desc: "Adds a one-click 'End task' option to the taskbar right-click menu for instant app termination.",
    tweak_storesearch_name: "Disable Store Recommendations in Search",
    tweak_storesearch_desc: "Hides recommended Microsoft Store apps from Start Menu search results by locking the Store database.",
    tweak_notifications_name: "Disable System Tray Notifications & Calendar",
    tweak_notifications_desc: "Turns off all toast notifications including the calendar flyout.",
    tweak_classicmenu_name: "Restore Classic Right-Click Context Menu",
    tweak_classicmenu_desc: "Brings back the full classic context menu in Windows 11 instead of the simplified one.",
    tweak_homegallery_name: "Remove Home & Gallery from File Explorer",
    tweak_homegallery_desc: "Removes the Home and Gallery entries from the Explorer sidebar and opens This PC by default.",
    tweak_edgedebloat_name: "Microsoft Edge - Debloat (Policies Only)",
    tweak_edgedebloat_desc: "Disables Edge telemetry, recommendations, rewards, shopping assistant and first-run popups via Group Policies.",
    tweak_fso_name: "Disable Fullscreen Optimizations (FSO)",
    tweak_fso_desc: "Disables Windows Fullscreen Optimizations globally. NOTE: disables color management in exclusive fullscreen.",
    tweak_ipv4_name: "Prefer IPv4 Over IPv6",
    tweak_ipv4_desc: "Makes Windows prefer IPv4 connections, reducing latency on private networks where IPv6 is not configured.",
    tweak_teredo_name: "Disable Teredo Tunneling",
    tweak_teredo_desc: "Disables the Teredo IPv6 tunnel that can add latency, while keeping IPv6 itself fully functional.",
    tweak_services_name: "Trim Services & SvcHost Memory Split",
    tweak_services_desc: "Sets redundant services to manual and matches SvcHostSplitThresholdInKB to your RAM, cutting svchost.exe process count.",
    tweak_vfx_name: "Set Visual Effects to Best Performance",
    tweak_vfx_desc: "Disables animations, shadows and transparency effects for snappier UI response on low-end hardware.",
    tweak_folderdiscover_name: "Disable Explorer Folder Type Discovery",
    tweak_folderdiscover_desc: "Stops Explorer from guessing folder types which slows browsing. WARNING: disables Explorer grouping.",
    tweak_storagesense_name: "Disable Storage Sense Auto Cleanup",
    tweak_storagesense_desc: "Prevents Storage Sense from silently deleting temp and recycle bin files without your review.",
    tweak_dismclean_name: "Deep Clean Component Store (DISM)",
    tweak_dismclean_desc: "Runs DISM component cleanup to remove superseded update files and reclaim several GB of drive space.",
    tweak_darkmode_name: "Dark Theme for Windows",
    tweak_darkmode_desc: "Switches the system and apps to dark mode (restarts Explorer to apply instantly).",
    tweak_extensions_name: "Show File Extensions in Explorer",
    tweak_extensions_desc: "Displays .exe, .png and other file extensions in File Explorer.",
    tweak_hiddenfiles_name: "Reveal Hidden Files in Explorer",
    tweak_hiddenfiles_desc: "Shows hidden files and folders in File Explorer.",
    tweak_battery_name: "Show Battery Percentage in Tray",
    tweak_battery_desc: "Displays the numeric battery percentage next to the battery icon in the system tray.",
    tweak_verboselogon_name: "Verbose Startup/Shutdown Messages",
    tweak_verboselogon_desc: "Shows detailed status messages during Windows startup and shutdown instead of the spinner.",
    tweak_bsod_name: "Detailed Blue Screen (BSoD) Info",
    tweak_bsod_desc: "Shows technical error text instead of the sad emoji on Blue Screen of Death.",
    tweak_onedrive_name: "Disable OneDrive & Remove from Explorer",
    tweak_onedrive_desc: "Stops OneDrive syncing, disables autostart, and unpins OneDrive from the File Explorer navigation sidebar.",
    cat_safety: "SAFETY",
    cat_preferences: "PREFERENCES",
    advanced_badge: "ADVANCED",
    advanced_confirm: "This tweak modifies deeper Windows settings and is not recommended for every system. Apply it anyway?",

    offline_banner_title: "You're offline",
    offline_banner_message: "Check your internet connection. Cloud features will resume automatically once you reconnect.",
    offline_banner_retry: "Retry",
    offline_banner_checking: "Checking...",
    offline_mode_label: "Offline Mode",

    search_placeholder_tweaks: "Search tweaks by name, category or keyword...",
    search_placeholder_cloud: "Search your cloud profiles by title or tag...",
    search_placeholder_shared: "Search shared configs by title or author...",
    search_placeholder_friends_filter: "Filter your friends...",
    search_placeholder_find_players: "Find players & friends by username...",
    search_placeholder_console: "Search execution logs...",
    search_placeholder_discover: "Search profiles by title, author or tag...",
    search_placeholder_scripts: "Search scripts by title, author or tag...",
    search_no_results: "No results found for \"{query}\"",
    find_players_title: "Find Players & Friends",
    user_results_title: "User Results",

    undo_tweak: "Undo",
    undo_tweak_tooltip: "Restore the original Windows values changed by this tweak",
    revert_all: "Revert All",
    revert_all_tooltip: "Revert every applied tweak back to its original Windows state",

    nav_utilities: "Utilities",
    util_title: "System Utilities",
    util_subtitle: "DNS switching, Windows Update modes, system fixes, optional Windows features and the WinGet app manager.",
    util_dns: "DNS",
    util_updates: "Updates",
    util_fixes: "Fixes",
    util_features: "Features",
    util_apps: "Apps",
    dns_current: "Current DNS Servers",
    dns_refresh: "Refresh",
    dns_active: "ACTIVE",
    dns_apply: "Use This DNS",
    update_default: "Default (Restore)",
    update_default_desc: "Restores standard Windows Update behavior exactly as shipped.",
    update_security: "Security (Recommended)",
    update_security_desc: "Delays feature updates by 365 days and security updates by 4 days to catch bad patches first.",
    update_disable: "Disable ALL Updates",
    update_disable_desc: "Turns off all Windows updates entirely. Only for isolated systems - leaves the PC without security patches.",
    update_apply: "Apply Mode",
    util_confirm_disable_updates: "WARNING: Disabling ALL Windows updates removes security patches from your system. Continue?",
    fix_network_reset: "Reset Network Stack",
    fix_network_reset_desc: "Runs netsh int ip reset and winsock reset to fix connectivity problems (reboot required).",
    fix_wu_reset: "Reset Windows Update",
    fix_wu_reset_desc: "Re-registers all Windows Update DLLs and restarts the update services.",
    fix_dism_scan: "System Corruption Scan",
    fix_dism_scan_desc: "Runs sfc /scannow and DISM /RestoreHealth to repair corrupted system files (can take several minutes).",
    fix_ntp: "Switch to NTP Pool",
    fix_ntp_desc: "Uses pool.ntp.org for more accurate time synchronization instead of time.windows.com.",
    fix_explorer: "Restart File Explorer",
    fix_explorer_desc: "Restarts the Explorer shell to apply UI changes without rebooting.",
    fix_icon_cache: "Clear Icon & Thumbnail Cache",
    fix_icon_cache_desc: "Clears and rebuilds corrupted icon and thumbnail databases, then restarts Explorer.",
    fix_run: "Run Fix",
    fix_running: "Running...",
    export_profile: "Export Profile",
    import_profile: "Import Profile",
    profile_exported_toast: "Profile JSON exported successfully!",
    profile_imported_toast: "Profile JSON imported successfully!",
    feature_dotnet: ".NET Framework (2, 3, 4)",
    feature_wsl: "Windows Subsystem for Linux (WSL)",
    feature_hyperv: "Hyper-V Virtualization",
    feature_legacy_media: "Legacy Media (WMP, DirectPlay)",
    feature_sandbox: "Windows Sandbox",
    feature_nfs: "Network File System (NFS)",
    feature_regbackup: "Daily Registry Backup (12:30 AM)",
    feature_enable: "Enable",
    feature_disable: "Disable",
    feature_reboot_notice: "Optional features may require a system restart to take effect.",
    apps_search_placeholder: "Search WinGet packages... (Enter to search)",
    apps_search_btn: "Search",
    apps_upgrade_all: "Upgrade All Apps",
    apps_upgrade_all_tooltip: "Upgrade every installed app through WinGet",
    apps_curated: "Curated Installer",
    apps_install: "Install",

    presets_tab_title: "Community Presets",
    presets_tab_subtitle: "Named tweak bundles shared by the community - apply a full setup in one click.",
    presets_publish: "Publish Preset",
    presets_publish_desc: "Publishing creates a preset from your currently enabled tweaks:",
    presets_publish_btn: "Publish",
    presets_publishing: "Publishing...",
    preset_name_ph: "Preset name...",
    preset_desc_ph: "Describe what this preset is for...",
    preset_tags_ph: "Tags (comma separated)",
    preset_contains_advanced: "This preset contains ADVANCED tweaks",
    preset_safe_only: "All tweaks are SAFE",
    preset_safe_badge: "SAFE",
    preset_remix: "Remix",
    preset_remix_of: "Remix of",
    preset_apply: "Apply Preset",
    presets_tweak_count: "tweaks",
    presets_empty: "No community presets yet",
    presets_empty_hint: "Publish your current tweak selection above to be the first!",
    presets_loading: "Loading community presets...",
    presence_online: "Online",
    presence_offline: "Offline",
  },
  "pt-BR": {
    nav_boost: "Impulso Rápido",
    nav_tweaks: "Customização de Otimizações",
    nav_logs: "Console de Execução",
    nav_cloud: "Perfis na Nuvem & Sync",
    nav_social: "Comunidade & Amigos",
    nav_discover: "Hub Discover",
    nav_settings: "Configurações & Segurança",
    admin_active: "ADMIN",
    admin_user: "USUÁRIO",
    minimize: "Minimizar",
    maximize: "Maximizar",
    close: "Fechar",

    boost_now: "OTIMIZAR",
    boosting: "OTIMIZANDO...",
    ready_to_optimize: "Pronto para otimizar o Windows",
    system_ready: "Sistema Pronto",
    system_optimized: "Sistema Otimizado",
    optimizations_queued: "otimizações na fila",
    dashboard_subtitle: "Otimizador de Desempenho e Debloater do Windows em 1 Clique",

    cat_all: "TODAS AS OTIMIZAÇÕES",
    cat_telemetry: "TELEMETRIA",
    cat_gaming: "JOGOS",
    cat_power: "ENERGIA",
    cat_debloat: "DEBLOAT",
    cat_cleanup: "LIMPEZA",
    save_profile_cloud: "Salvar Perfil na Nuvem",

    settings_title: "Preferências e Segurança do 1boost",
    settings_subtitle: "Configure bloqueio por senha, idioma, efeitos visuais, bandeja do sistema e atualizações.",

    app_language: "Idioma do Aplicativo",
    app_language_desc: "Escolha entre Inglês e Português do Brasil natural (PT-BR).",
    show_profile_island: "Exibir Card de Perfil na Página Inicial",
    show_profile_island_desc: "Mostrar o atalho rápido de perfil com foto e nick no rodapé da tela inicial de impulso.",
    app_lock: "Bloquear Aplicativo com Senha",
    app_lock_desc: "Exigir uma senha de segurança criptografada para iniciar e acessar o 1boost.",
    btn_set_lock_password: "Definir Senha de Segurança",
    app_lock_protected: "1boost Protegido por Senha",
    app_lock_placeholder: "Digite a senha do aplicativo para desbloquear...",
    app_lock_incorrect: "Senha incorreta. Tente novamente.",
    app_lock_unlock: "DESBLOQUEAR 1BOOST",
    app_lock_verifying: "Verificando...",
    check_for_updates: "Atualizações Automáticas do GitHub",
    check_for_updates_desc: "Verifique novos lançamentos diretamente do GitHub Releases.",
    btn_check_updates: "Verificar Atualizações",
    minimize_to_tray: "Minimizar para a Bandeja do Sistema",
    minimize_to_tray_desc: "Manter o 1boost rodando em segundo plano na bandeja do Windows ao minimizar ou fechar.",
    visual_effects: "Efeitos Visuais e Customização",
    parallax_stars: "Fundo de Estrelas Parallax",
    parallax_stars_desc: "Animação suave em canvas a 60fps respondendo ao movimento do cursor na página inicial.",
    system_protection: "Proteção do Sistema e Segurança",
    auto_restore_point: "Ponto de Restauração Automático",
    auto_restore_point_desc: "Executa Checkpoint-Computer antes de aplicar ajustes de PowerShell e Registro.",
    reset_default: "Restaurar Otimizações Padrão",

    console_title: "Logs do Console de Execução",
    console_subtitle: "Saída em tempo real dos scripts nativos de PowerShell do Windows.",
    clear_logs: "Limpar Logs do Console",
    filter_all: "Todos os Logs",
    filter_info: "Informativo",
    filter_success: "Sucesso",
    filter_error: "Erros",

    sign_in: "ENTRAR",
    sign_up: "CADASTRAR",
    account_created: "Conta criada! Verifique seu e-mail para confirmar o cadastro.",
    username_email: "Nome de Usuário ou E-mail",
    gaming_username: "Nome de Usuário Gamer",
    email_address: "Endereço de E-mail",
    password: "Senha",
    confirm_password: "Confirmar Senha",
    passwords_mismatch: "As senhas não coincidem",
    create_account: "CRIAR CONTA",
    generate_nick: "Gerar Nick Aleatório de Jogo",
    change_avatar: "Foto de Perfil e Avatar",
    upload_image: "Enviar Imagem",
    change_password: "Alterar Senha (Reautenticação de Segurança)",
    current_password: "Senha Atual (Verificação)",
    new_password: "Nova Senha",
    update_username: "Atualizar Nick",

    cloud_profiles_title: "Perfis de Otimização na Nuvem",
    cloud_profiles_subtitle: "Salve sua combinação de otimizações na nuvem ou aplique um perfil configurado com 1 clique.",
    shared_with_me: "Compartilhados Comigo",
    my_cloud_configs: "Meus Perfis na Nuvem",
    friends_squad: "Amigos",
    apply_profile: "APLICAR PERFIL",
    sync_and_apply: "Sincronizar e Aplicar",
    share: "Compartilhar",
    delete: "Excluir",
    save_profile: "Salvar Perfil",
    profile_title_prompt: "Digite um título para este perfil de otimização:",
    enter_username: "Digite o nick exato...",
    send_request: "Enviar Pedido",
    accept: "Aceitar",

    tweak_mouse_accel_name: "Desativar Aceleração do Mouse (Entrada Bruta 1:1)",
    tweak_mouse_accel_desc: "Desativa o Aprimorar Precisão do Ponteiro para garantir rastreamento 1:1 exato em jogos competitivos.",
    tweak_mouse_hover_name: "Reduzir Atraso de Resposta do Cursor (Hover)",
    tweak_mouse_hover_desc: "Reduz MenuShowDelay de 400ms para 8ms, acelerando a abertura de menus e resposta do sistema.",
    tweak_hags_name: "Ativar Agendamento de GPU Acelerado por Hardware (HAGS)",
    tweak_hags_desc: "Delega a gestão de memória VRAM diretamente à GPU, estabilizando os 1% low FPS em jogos pesados.",
    tweak_mmcss_name: "Otimizar Prioridade de Jogos no MMCSS",
    tweak_mmcss_desc: "Define SystemResponsiveness para 0% e Prioridade de GPU para 8 para agendamento máximo de threads de jogos.",
    tweak_gamedvr_name: "Desativar Windows Game DVR e Gravação em Segundo Plano",
    tweak_gamedvr_desc: "Desliga a gravação automática do Xbox e overlays para liberar recursos do codificador da GPU.",
    tweak_nagle_name: "Desativar Algoritmo de Nagle (Rede sem Latência no TCP)",
    tweak_nagle_desc: "Define TcpAckFrequency e TcpNoDelay para 1 para enviar pacotes de rede de jogos multiplayer instantaneamente.",
    tweak_p2p_name: "Desativar Envios P2P da Otimização de Entrega",
    tweak_p2p_desc: "Impede que o Windows Update consuma sua banda fazendo upload de arquivos para outros PCs na internet.",
    tweak_power_name: "Desbloquear Plano de Energia Desempenho Máximo",
    tweak_power_desc: "Ativa o plano oculto Desempenho Máximo para impedir que o processador reduza o clock em jogos.",
    tweak_corepark_name: "Desativar Estacionamento de Núcleos (CPU Core Parking)",
    tweak_corepark_desc: "Garante que todos os núcleos lógicos da CPU fiquem 100% ativos sem entrar em estado de economia.",
    tweak_hibernation_name: "Desativar Arquivo de Hibernação (Libera Espaço em Disco)",
    tweak_hibernation_desc: "Remove o arquivo hiberfil.sys para recuperar espaço em disco equivalente à sua memória RAM.",
    tweak_bgapps_name: "Desativar Aplicativos da Microsoft Store em Segundo Plano",
    tweak_bgapps_desc: "Impede que aplicativos da Store rodem em segundo plano consumindo memória RAM desnecessária.",
    tweak_telemetry_name: "Desativar Serviços de Telemetria e DiagTrack",
    tweak_telemetry_desc: "Interrompe os serviços de Experiência do Usuário Conectado e Telemetria de enviarem dados à Microsoft.",
    tweak_diagkeys_name: "Remover Chaves de Diagnóstico e Coleta de Dados",
    tweak_diagkeys_desc: "Define AllowTelemetry como 0 (modo Segurança) e desativa os avisos de frequência de feedback.",
    tweak_teletasks_name: "Desativar Tarefas Agendadas de Telemetria",
    tweak_teletasks_desc: "Desativa as tarefas agendadas de Application Experience, ProgramDataUpdater e CEIP.",
    tweak_gamemode_name: "Ativar Modo de Jogo do Windows",
    tweak_gamemode_desc: "Aloca o máximo de recursos de CPU e GPU para jogos ativos, impedindo instalações em segundo plano.",
    tweak_throttling_name: "Desativar Limitação de Energia (Power Throttling)",
    tweak_throttling_desc: "Garante que tarefas em segundo plano e jogos em tela cheia recebam todo o throughput da CPU.",
    tweak_bing_name: "Desativar Pesquisa Bing no Menu Iniciar",
    tweak_bing_desc: "Interrompe consultas de pesquisa web no Menu Iniciar e a sobrecarga de telemetria da Cortana.",
    tweak_widgets_name: "Desativar Feed de Widgets do Windows",
    tweak_widgets_desc: "Desativa os processos do feed de notícias dos Widgets na barra de tarefas e seu consumo de memória.",
    tweak_tempfiles_name: "Limpar Arquivos Temporários e Cache",
    tweak_tempfiles_desc: "Limpa arquivos temporários do usuário (%TEMP%), temporários do Windows e armazenamento de prefetch.",
    tweak_dnsflush_name: "Limpar Cache do Resolvedor DNS",
    tweak_dnsflush_desc: "Limpa as tabelas de consulta de domínio em cache para renovar o roteamento de rede e resolver IPs obsoletos.",
    tweak_location_name: "Desativar Rastreamento de Localização e Sensores",
    tweak_location_desc: "Bloqueia o acesso de aplicativos à sua localização e desativa o serviço de Localização (lfsvc) em segundo plano.",
    tweak_advertising_name: "Desativar ID de Publicidade (Rastreamento)",
    tweak_advertising_desc: "Desliga o ID de Publicidade único que o Windows usa para exibir anúncios direcionados e rastrear sua atividade.",
    tweak_wer_name: "Desativar Relatório de Erros do Windows (WER)",
    tweak_wer_desc: "Interrompe os diálogos de erro e o envio de dados ao serviço de relatórios da Microsoft (Watson).",
    tweak_cortana_name: "Desativar Cortana e Ativação por Voz",
    tweak_cortana_desc: "Desativa a integração de pesquisa da Cortana, ativação por voz e o processamento de fala em segundo plano.",
    tweak_tips_name: "Desativar Dicas e Sugestões do Windows",
    tweak_tips_desc: "Suprime dicas de tela de bloqueio, sugestões de aplicativos e avisos de integração da Microsoft.",
    tweak_eee_name: "Desativar Ethernet Eficiente em Energia (EEE)",
    tweak_eee_desc: "Desativa a economia de energia Green Ethernet em todas as placas de rede para reduzir picos de ping em jogos.",
    tweak_usb_name: "Desativar Suspensão Seletiva de USB",
    tweak_usb_desc: "Impede que o Windows suspenda portas USB, evitando picos de atraso e desconexões de mouse e teclado.",
    tweak_largecache_name: "Ativar Cache Grande do Sistema",
    tweak_largecache_desc: "Dá ao cache de arquivos do kernel mais RAM para trabalhar, acelerando leituras frequentes de disco em jogos e apps.",
    tweak_wpbt_name: "Desativar Tabela Binária de Plataforma do Windows (WPBT)",
    tweak_wpbt_desc: "Bloqueia a execução de softwares do fabricante na inicialização (anti-roubo/drivers) sem o seu consentimento.",
    tweak_devmeta_name: "Impedir Instalação de Apps Complementares de Dispositivos",
    tweak_devmeta_desc: "Bloqueia downloads automáticos de drivers/softwares ao conectar novos dispositivos.",
    tweak_activity_name: "Desativar Rastreamento de Histórico de Atividades",
    tweak_activity_desc: "Apaga documentos recentes, área de transferência e histórico de execução, e impede o Windows de publicar atividades.",
    tweak_consumer_name: "Desativar Recursos de Consumo e Sugestões de Apps",
    tweak_consumer_desc: "Interrompe instalações promovidas, recomendações da Store e sugestões de integração da Microsoft.",
    tweak_endtask_name: "Ativar 'Encerrar Tarefa' no Menu de Contexto da Barra de Tarefas",
    tweak_endtask_desc: "Adiciona a opção 'Encerrar tarefa' com 1 clique ao clicar com o botão direito em um programa na barra de tarefas.",
    tweak_storesearch_name: "Desativar Recomendações da Store na Pesquisa",
    tweak_storesearch_desc: "Oculta apps recomendados da Microsoft Store nos resultados de pesquisa do Menu Iniciar bloqueando o banco de dados da Store.",
    tweak_notifications_name: "Desativar Notificações e Calendário do Sistema",
    tweak_notifications_desc: "Desliga todas as notificações toast, incluindo o painel de calendário.",
    tweak_classicmenu_name: "Restaurar Menu de Contexto Clássico",
    tweak_classicmenu_desc: "Traz de volta o menu de contexto completo do Windows 11 em vez da versão simplificada.",
    tweak_homegallery_name: "Remover Início e Galeria do Explorador de Arquivos",
    tweak_homegallery_desc: "Remove as entradas Início e Galeria da barra lateral do Explorer e abre Este PC por padrão.",
    tweak_edgedebloat_name: "Microsoft Edge - Debloat (Apenas Políticas)",
    tweak_edgedebloat_desc: "Desativa telemetria, recomendações, recompensas, assistente de compras e popups de primeira execução do Edge via Políticas de Grupo.",
    tweak_fso_name: "Desativar Otimizações de Tela Cheia (FSO)",
    tweak_fso_desc: "Desativa as Otimizações de Tela Cheia do Windows globalmente. ATENÇÃO: desativa gestão de cores em tela cheia exclusiva.",
    tweak_ipv4_name: "Preferir IPv4 em vez de IPv6",
    tweak_ipv4_desc: "Faz o Windows preferir conexões IPv4, reduzindo a latência em redes privadas sem IPv6 configurado.",
    tweak_teredo_name: "Desativar Túnel Teredo",
    tweak_teredo_desc: "Desativa o túnel IPv6 Teredo que pode adicionar latência, mantendo o IPv6 totalmente funcional.",
    tweak_services_name: "Otimizar Serviços e Divisão de Memória SvcHost",
    tweak_services_desc: "Define serviços redundantes como manual e ajusta SvcHostSplitThresholdInKB à sua RAM, reduzindo processos svchost.exe.",
    tweak_vfx_name: "Definir Efeitos Visuais como Melhor Desempenho",
    tweak_vfx_desc: "Desativa animações, sombras e efeitos de transparência para resposta de interface mais rápida em hardware fraco.",
    tweak_folderdiscover_name: "Desativar Descoberta Automática de Tipos de Pasta",
    tweak_folderdiscover_desc: "Impede que o Explorer adivinhe o tipo de pasta (música, imagens...), o que desacelera a navegação. ATENÇÃO: desativa agrupamento.",
    tweak_storagesense_name: "Desativar Limpeza Automática do Gerenciador de Armazenamento",
    tweak_storagesense_desc: "Impede que o Gerenciador de Armazenamento apague arquivos temporários e da lixeira silenciosamente.",
    tweak_dismclean_name: "Limpeza Profunda do Component Store (DISM)",
    tweak_dismclean_desc: "Executa a limpeza de componentes DISM para remover arquivos de atualização obsoletos e liberar vários GB de espaço.",
    tweak_darkmode_name: "Tema Escuro do Windows",
    tweak_darkmode_desc: "Ativa o modo escuro no sistema e aplicativos (reinicia o Explorer para aplicar na hora).",
    tweak_extensions_name: "Mostrar Extensões de Arquivo no Explorer",
    tweak_extensions_desc: "Exibe as extensões .exe, .png e outras no Explorador de Arquivos.",
    tweak_hiddenfiles_name: "Revelar Arquivos Ocultos no Explorer",
    tweak_hiddenfiles_desc: "Mostra arquivos e pastas ocultos no Explorador de Arquivos.",
    tweak_battery_name: "Mostrar Porcentagem da Bateria na Bandeja",
    tweak_battery_desc: "Exibe a porcentagem numérica da bateria ao lado do ícone na bandeja do sistema.",
    tweak_verboselogon_name: "Mensagens Detalhadas de Inicialização/Desligamento",
    tweak_verboselogon_desc: "Exibe mensagens de status detalhadas durante a inicialização e desligamento do Windows.",
    tweak_bsod_name: "Informações Detalhadas na Tela Azul (BSoD)",
    tweak_bsod_desc: "Exibe o texto técnico do erro em vez do emoji triste na Tela Azul da Morte.",
    tweak_onedrive_name: "Desativar OneDrive e Remover do Explorador",
    tweak_onedrive_desc: "Interrompe a sincronização do OneDrive, desativa a inicialização automática e remove o OneDrive da barra lateral do Explorador.",
    cat_safety: "SEGURANÇA",
    cat_preferences: "PREFERÊNCIAS",
    advanced_badge: "AVANÇADO",
    advanced_confirm: "Esta otimização modifica configurações profundas do Windows e não é recomendada para todos os sistemas. Aplicar mesmo assim?",

    offline_banner_title: "Você está offline",
    offline_banner_message: "Verifique sua conexão com a internet. Os recursos na nuvem voltarão automaticamente quando você reconectar.",
    offline_banner_retry: "Tentar Novamente",
    offline_banner_checking: "Verificando...",
    offline_mode_label: "Modo Offline",

    search_placeholder_tweaks: "Pesquisar otimizações por nome, categoria ou palavra-chave...",
    search_placeholder_cloud: "Pesquisar seus perfis na nuvem por título ou tag...",
    search_placeholder_shared: "Pesquisar perfis compartilhados por título ou autor...",
    search_placeholder_friends_filter: "Filtrar seus amigos...",
    search_placeholder_find_players: "Encontrar jogadores e amigos pelo nick...",
    search_placeholder_console: "Pesquisar nos logs de execução...",
    search_placeholder_discover: "Pesquisar perfis por título, autor ou tag...",
    search_placeholder_scripts: "Pesquisar scripts por título, autor ou tag...",
    search_no_results: "Nenhum resultado encontrado para \"{query}\"",
    find_players_title: "Encontrar Jogadores e Amigos",
    user_results_title: "Resultados de Usuários",

    undo_tweak: "Desfazer",
    undo_tweak_tooltip: "Restaurar os valores originais do Windows alterados por esta otimização",
    revert_all: "Reverter Tudo",
    revert_all_tooltip: "Reverter todas as otimizações aplicadas ao estado original do Windows",

    nav_utilities: "Utilitários",
    util_title: "Utilitários do Sistema",
    util_subtitle: "Troca de DNS, modos do Windows Update, correções do sistema, recursos opcionais do Windows e o gerenciador de apps WinGet.",
    util_dns: "DNS",
    util_updates: "Atualizações",
    util_fixes: "Correções",
    util_features: "Recursos",
    util_apps: "Apps",
    dns_current: "Servidores DNS Atuais",
    dns_refresh: "Atualizar",
    dns_active: "ATIVO",
    dns_apply: "Usar Este DNS",
    update_default: "Padrão (Restaurar)",
    update_default_desc: "Restaura o comportamento padrão do Windows Update exatamente como veio de fábrica.",
    update_security: "Segurança (Recomendado)",
    update_security_desc: "Adia atualizações de recursos por 365 dias e atualizações de segurança por 4 dias para evitar patches ruins.",
    update_disable: "Desativar TODAS as Atualizações",
    update_disable_desc: "Desliga todas as atualizações do Windows. Somente para sistemas isolados - deixa o PC sem patches de segurança.",
    update_apply: "Aplicar Modo",
    util_confirm_disable_updates: "ATENÇÃO: Desativar TODAS as atualizações do Windows remove os patches de segurança do seu sistema. Continuar?",
    fix_network_reset: "Redefinir Pilha de Rede",
    fix_network_reset_desc: "Executa netsh int ip reset e winsock reset para corrigir problemas de conectividade (requer reinicialização).",
    fix_wu_reset: "Redefinir Windows Update",
    fix_wu_reset_desc: "Re-registra todas as DLLs do Windows Update e reinicia os serviços de atualização.",
    fix_dism_scan: "Verificação de Corrupção do Sistema",
    fix_dism_scan_desc: "Executa sfc /scannow e DISM /RestoreHealth para reparar arquivos corrompidos (pode levar vários minutos).",
    fix_ntp: "Mudar para NTP Pool",
    fix_ntp_desc: "Usa pool.ntp.org para sincronização de horário mais precisa em vez de time.windows.com.",
    fix_explorer: "Reiniciar Explorador de Arquivos",
    fix_explorer_desc: "Reinicia o shell do Explorer para aplicar mudanças visuais sem reiniciar o PC.",
    fix_icon_cache: "Limpar Cache de Ícones e Miniaturas",
    fix_icon_cache_desc: "Limpa e recria bancos de dados corrompidos de ícones e miniaturas, e reinicia o Explorer.",
    fix_run: "Executar Correção",
    fix_running: "Executando...",
    export_profile: "Exportar Perfil",
    import_profile: "Importar Perfil",
    profile_exported_toast: "Perfil JSON exportado com sucesso!",
    profile_imported_toast: "Perfil JSON importado com sucesso!",
    feature_dotnet: ".NET Framework (2, 3, 4)",
    feature_wsl: "Subsistema Windows para Linux (WSL)",
    feature_hyperv: "Virtualização Hyper-V",
    feature_legacy_media: "Mídia Legada (WMP, DirectPlay)",
    feature_sandbox: "Windows Sandbox",
    feature_nfs: "Sistema de Arquivos de Rede (NFS)",
    feature_regbackup: "Backup Diário do Registro (00:30)",
    feature_enable: "Ativar",
    feature_disable: "Desativar",
    feature_reboot_notice: "Recursos opcionais podem exigir reinicialização do sistema para entrar em vigor.",
    apps_search_placeholder: "Pesquisar pacotes WinGet... (Enter para pesquisar)",
    apps_search_btn: "Pesquisar",
    apps_upgrade_all: "Atualizar Todos os Apps",
    apps_upgrade_all_tooltip: "Atualiza todos os aplicativos instalados pelo WinGet",
    apps_curated: "Instalador Curado",
    apps_install: "Instalar",

    presets_tab_title: "Presets da Comunidade",
    presets_tab_subtitle: "Conjuntos de otimizações nomeados compartilhados pela comunidade - aplique uma configuração completa com 1 clique.",
    presets_publish: "Publicar Preset",
    presets_publish_desc: "Publicar cria um preset com as otimizações atualmente ativadas:",
    presets_publish_btn: "Publicar",
    presets_publishing: "Publicando...",
    preset_name_ph: "Nome do preset...",
    preset_desc_ph: "Descreva para que serve este preset...",
    preset_tags_ph: "Tags (separadas por vírgula)",
    preset_contains_advanced: "Este preset contém otimizações AVANÇADAS",
    preset_safe_only: "Todas as otimizações são SEGURAS",
    preset_safe_badge: "SEGURO",
    preset_remix: "Remix",
    preset_remix_of: "Remix de",
    preset_apply: "Aplicar Preset",
    presets_tweak_count: "otimizações",
    presets_empty: "Nenhum preset da comunidade ainda",
    presets_empty_hint: "Publique sua seleção atual de otimizações acima para ser o primeiro!",
    presets_loading: "Carregando presets da comunidade...",
    presence_online: "Online",
    presence_offline: "Offline",
  },
};
