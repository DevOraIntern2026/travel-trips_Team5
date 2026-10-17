import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../../../core/di/service_locator.dart';
import '../../../../core/storage/token_storage.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/app_widgets.dart';
import '../../../auth/data/models/user_model.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  UserModel? _user;
  bool _loading = true;
  bool _pushEnabled = true;
  bool _emailEnabled = true;
  bool _tripUpdatesEnabled = true;

  @override
  void initState() {
    super.initState();
    _loadProfile();
  }

  Future<void> _loadProfile() async {
    final storage = getIt<TokenStorage>();
    final preferences = await SharedPreferences.getInstance();
    if (!mounted) return;
    setState(() {
      _user = null;
      _pushEnabled = preferences.getBool('profile_push_enabled') ?? true;
      _emailEnabled = preferences.getBool('profile_email_enabled') ?? true;
      _tripUpdatesEnabled = preferences.getBool('profile_trip_updates') ?? true;
    });
    final localUser = await storage.getUser();
    try {
      final response = await getIt<Dio>().get('users/me');
      final payload = response.data is Map
          ? Map<String, dynamic>.from(response.data as Map)
          : <String, dynamic>{};
      final raw = payload['data'] is Map
          ? Map<String, dynamic>.from(payload['data'] as Map)
          : payload;
      if (raw['id'] != null && raw['email'] != null) {
        final user = UserModel.fromJson(raw);
        await storage.saveUser(user);
        if (mounted) setState(() => _user = user);
      } else if (mounted) {
        setState(() => _user = localUser);
      }
    } on Object {
      if (mounted) setState(() => _user = localUser);
    }
    if (mounted) setState(() => _loading = false);
  }

  Future<void> _editProfile() async {
    final user = _user;
    if (user == null) return;
    final nameController = TextEditingController(text: user.name ?? '');
    final emailController = TextEditingController(text: user.email);
    final formKey = GlobalKey<FormState>();
    final values = await showDialog<(String, String)>(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: Text('Edit profile', style: AppText.title(20)),
        content: Form(
          key: formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextFormField(
                controller: nameController,
                textCapitalization: TextCapitalization.words,
                decoration: const InputDecoration(labelText: 'Full name'),
                validator: (value) => value == null || value.trim().isEmpty
                    ? 'Enter your name'
                    : null,
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: emailController,
                keyboardType: TextInputType.emailAddress,
                decoration: const InputDecoration(labelText: 'Email address'),
                validator: (value) => value == null || !value.contains('@')
                    ? 'Enter a valid email'
                    : null,
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogContext),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () {
              if (formKey.currentState!.validate()) {
                Navigator.pop(dialogContext, (
                  nameController.text.trim(),
                  emailController.text.trim(),
                ));
              }
            },
            child: const Text('Save changes'),
          ),
        ],
      ),
    );
    nameController.dispose();
    emailController.dispose();
    if (values == null || !mounted) return;
    try {
      final response = await getIt<Dio>().patch(
        'users/me',
        data: {'name': values.$1, 'email': values.$2},
      );
      final payload = response.data is Map
          ? Map<String, dynamic>.from(response.data as Map)
          : <String, dynamic>{};
      final raw = payload['data'] is Map
          ? Map<String, dynamic>.from(payload['data'] as Map)
          : payload;
      final updated = UserModel.fromJson(raw);
      await getIt<TokenStorage>().saveUser(updated);
      if (mounted) setState(() => _user = updated);
      _message('Profile updated');
    } on Object {
      _message('Could not update your profile. Please try again.');
    }
  }

  Future<void> _setPreference(String key, bool value) async {
    final preferences = await SharedPreferences.getInstance();
    await preferences.setBool(key, value);
  }

  void _message(String message) {
    if (!mounted) return;
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(SnackBar(content: Text(message)));
  }

  Future<void> _signOut() async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Sign out?'),
        content: const Text(
          'You can sign back in any time to manage your trips.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Stay signed in'),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Sign out'),
          ),
        ],
      ),
    );
    if (confirmed != true) return;
    await getIt<TokenStorage>().clearSession();
    if (mounted) context.go('/login');
  }

  void _showAbout() => showAboutDialog(
    context: context,
    applicationName: 'TravelOra',
    applicationVersion: '1.0.0',
    applicationIcon: const Icon(
      Icons.explore,
      color: AppColors.primary,
      size: 34,
    ),
    children: const [
      Text(
        'Discover curated trips, manage reservations and keep your travel plans in one place.',
      ),
    ],
  );

  Future<void> _contactSupport() async {
    await Clipboard.setData(const ClipboardData(text: 'support@travelora.app'));
    _message('Support email copied: support@travelora.app');
  }

  @override
  Widget build(BuildContext context) {
    final user = _user;
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: _loading
            ? const Center(child: CircularProgressIndicator())
            : ListView(
                padding: const EdgeInsets.fromLTRB(18, 18, 18, 30),
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text('Your profile', style: AppText.title(28)),
                      ),
                      const AppPill(
                        'TRAVELER',
                        background: AppColors.mint,
                        foreground: AppColors.primary,
                      ),
                    ],
                  ),
                  const SizedBox(height: 18),
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(24),
                      gradient: const LinearGradient(
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                        colors: [AppColors.primary, Color(0xFF17605E)],
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: AppColors.primary.withAlpha(35),
                          blurRadius: 20,
                          offset: const Offset(0, 9),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            CircleAvatar(
                              radius: 30,
                              backgroundColor: Colors.white.withAlpha(35),
                              child: Text(
                                (user?.name?.trim().isNotEmpty == true
                                        ? user!.name!.trim()[0]
                                        : 'T')
                                    .toUpperCase(),
                                style: AppText.title(24, Colors.white),
                              ),
                            ),
                            const SizedBox(width: 14),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    user?.name ?? 'TravelOra traveler',
                                    style: AppText.title(19, Colors.white),
                                  ),
                                  const SizedBox(height: 3),
                                  Text(
                                    user?.email ?? 'Sign in to sync your trips',
                                    style: AppText.body(
                                      12.5,
                                      Colors.white.withAlpha(210),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            IconButton(
                              onPressed: user == null
                                  ? () => context.go('/login')
                                  : _editProfile,
                              tooltip: user == null
                                  ? 'Sign in'
                                  : 'Edit profile',
                              icon: Icon(
                                user == null
                                    ? Icons.login
                                    : Icons.edit_outlined,
                                color: Colors.white,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 18),
                        Container(height: 1, color: Colors.white.withAlpha(40)),
                        const SizedBox(height: 14),
                        Row(
                          children: [
                            const Icon(
                              Icons.verified_user_outlined,
                              color: AppColors.mint,
                              size: 17,
                            ),
                            const SizedBox(width: 8),
                            Text(
                              user?.emailVerified == true
                                  ? 'Verified account'
                                  : 'Your trips, all in one place',
                              style: AppText.label(12.5, Colors.white),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 22),
                  Text(
                    'TRAVEL ACCOUNT',
                    style: AppText.mono(11, AppColors.muted, FontWeight.w700),
                  ),
                  const SizedBox(height: 8),
                  _section([
                    _ActionTile(
                      icon: Icons.luggage_outlined,
                      title: 'My bookings',
                      subtitle: 'Track upcoming and past trips',
                      onTap: () => context.go('/bookings'),
                    ),
                    _ActionTile(
                      icon: Icons.notifications_active_outlined,
                      title: 'Notifications',
                      subtitle: 'Updates, seat alerts and trip prep',
                      onTap: () => context.go('/alerts'),
                    ),
                    _ActionTile(
                      icon: Icons.person_outline,
                      title: 'Personal information',
                      subtitle: 'Name and email address',
                      onTap: user == null
                          ? () => context.go('/login')
                          : _editProfile,
                    ),
                  ]),
                  const SizedBox(height: 22),
                  Text(
                    'PREFERENCES',
                    style: AppText.mono(11, AppColors.muted, FontWeight.w700),
                  ),
                  const SizedBox(height: 8),
                  _section([
                    _PreferenceTile(
                      icon: Icons.notifications_outlined,
                      title: 'Push notifications',
                      value: _pushEnabled,
                      onChanged: (value) {
                        setState(() => _pushEnabled = value);
                        _setPreference('profile_push_enabled', value);
                      },
                    ),
                    _PreferenceTile(
                      icon: Icons.flight_outlined,
                      title: 'Trip and seat updates',
                      value: _tripUpdatesEnabled,
                      onChanged: (value) {
                        setState(() => _tripUpdatesEnabled = value);
                        _setPreference('profile_trip_updates', value);
                      },
                    ),
                    _PreferenceTile(
                      icon: Icons.email_outlined,
                      title: 'Email updates',
                      value: _emailEnabled,
                      onChanged: (value) {
                        setState(() => _emailEnabled = value);
                        _setPreference('profile_email_enabled', value);
                      },
                    ),
                  ]),
                  const SizedBox(height: 22),
                  Text(
                    'HELP & ABOUT',
                    style: AppText.mono(11, AppColors.muted, FontWeight.w700),
                  ),
                  const SizedBox(height: 8),
                  _section([
                    _ActionTile(
                      icon: Icons.support_agent_outlined,
                      title: 'Contact support',
                      subtitle: 'Copy our support email',
                      onTap: _contactSupport,
                    ),
                    _ActionTile(
                      icon: Icons.info_outline,
                      title: 'About TravelOra',
                      subtitle: 'App information and version',
                      onTap: _showAbout,
                    ),
                  ]),
                  const SizedBox(height: 20),
                  OutlinedButton.icon(
                    onPressed: user == null
                        ? () => context.go('/login')
                        : _signOut,
                    icon: Icon(user == null ? Icons.login : Icons.logout),
                    label: Text(user == null ? 'Sign in' : 'Sign out'),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AppColors.error,
                      minimumSize: const Size.fromHeight(52),
                      side: BorderSide(color: AppColors.error.withAlpha(80)),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(15),
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Center(
                    child: Text(
                      'TravelOra · Explore with confidence',
                      style: AppText.body(11, AppColors.muted),
                    ),
                  ),
                ],
              ),
      ),
    );
  }

  Widget _section(List<Widget> children) => Container(
    decoration: BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(20),
      border: Border.all(color: AppColors.border),
    ),
    child: Column(children: children),
  );
}

class _ActionTile extends StatelessWidget {
  const _ActionTile({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.onTap,
  });
  final IconData icon;
  final String title;
  final String subtitle;
  final VoidCallback onTap;
  @override
  Widget build(BuildContext context) => ListTile(
    onTap: onTap,
    leading: AppIconBox(icon, background: AppColors.infoSurface, size: 42),
    title: Text(title, style: AppText.label(14)),
    subtitle: Text(subtitle, style: AppText.body(11.5, AppColors.muted)),
    trailing: const Icon(Icons.chevron_right, size: 20, color: AppColors.muted),
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
    contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 3),
  );
}

class _PreferenceTile extends StatelessWidget {
  const _PreferenceTile({
    required this.icon,
    required this.title,
    required this.value,
    required this.onChanged,
  });
  final IconData icon;
  final String title;
  final bool value;
  final ValueChanged<bool> onChanged;
  @override
  Widget build(BuildContext context) => SwitchListTile.adaptive(
    secondary: AppIconBox(icon, background: AppColors.infoSurface, size: 42),
    title: Text(title, style: AppText.label(13.5)),
    value: value,
    onChanged: onChanged,
    activeTrackColor: AppColors.primary,
    contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 2),
  );
}
