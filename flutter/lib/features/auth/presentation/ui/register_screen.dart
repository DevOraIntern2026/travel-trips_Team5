import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../core/di/service_locator.dart';
import '../cubit/auth_cubit.dart';
import '../cubit/auth_state.dart';
import '../theme/auth_colors.dart';
import '../utils/auth_validators.dart';
import '../widgets/auth_buttons.dart';
import '../widgets/auth_form_widgets.dart';
import '../widgets/auth_text_field.dart';
import '../widgets/auth_top_bar.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  static const _countryCodes = <(String, String)>[
    ('Ã°Å¸â€¡ÂªÃ°Å¸â€¡Â¬', '+20'),
    ('Ã°Å¸â€¡Â¸Ã°Å¸â€¡Â¦', '+966'),
    ('Ã°Å¸â€¡Â¦Ã°Å¸â€¡Âª', '+971'),
    ('Ã°Å¸â€¡Â®Ã°Å¸â€¡Â¹', '+39'),
    ('Ã°Å¸â€¡Â¬Ã°Å¸â€¡Â§', '+44'),
    ('Ã°Å¸â€¡ÂºÃ°Å¸â€¡Â¸', '+1'),
  ];

  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _phoneController = TextEditingController();

  bool _obscurePassword = true;
  bool _acceptedTerms = false;
  bool _wantsAlerts = false;
  String _countryCode = '+20';

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _phoneController.dispose();
    super.dispose();
  }

  void _register(BuildContext context) {
    if (!_formKey.currentState!.validate()) return;

    if (!_acceptedTerms) {
      ScaffoldMessenger.of(context)
        ..hideCurrentSnackBar()
        ..showSnackBar(
          const SnackBar(
            content: Text('Please accept the Terms of Service to continue'),
          ),
        );
      return;
    }

    context.read<AuthCubit>().register(
      name: _nameController.text.trim(),
      email: _emailController.text.trim(),
      password: _passwordController.text,
    );
  }

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => getIt<AuthCubit>(),
      child: Builder(
        builder: (context) {
          return Scaffold(
            backgroundColor: AuthColors.background,
            body: SafeArea(
              child: Column(
                children: [
                  const AuthTopBar(title: 'Trip Detail', showClose: true),
                  Expanded(
                    child: SingleChildScrollView(
                      padding: const EdgeInsets.fromLTRB(24, 20, 24, 24),
                      child: Form(
                        key: _formKey,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            _buildHeader(),
                            const SizedBox(height: 22),
                            _buildFields(),
                            const SizedBox(height: 18),
                            _buildAgreements(),
                            const SizedBox(height: 20),
                            _buildSubmit(context),
                            const SizedBox(height: 20),
                            const AuthOrDivider(label: 'OR SIGN UP WITH'),
                            const SizedBox(height: 16),
                            AuthSocialButton.apple(
                              label: 'Sign up with Apple',
                              onPressed: () {
                                // TODO: Apple sign-up
                              },
                            ),
                            const SizedBox(height: 10),
                            AuthSocialButton.google(
                              label: 'Sign up with Google',
                              background: Colors.white,
                              borderColor: AuthColors.border,
                              onPressed: () {
                                // TODO: Google sign-up
                              },
                            ),
                            const SizedBox(height: 22),
                            _buildFooter(context),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildHeader() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
          decoration: BoxDecoration(
            color: AuthColors.mint,
            borderRadius: BorderRadius.circular(20),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.hiking, size: 16, color: AuthColors.primary),
              const SizedBox(width: 6),
              Text(
                'Expedition Ready',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 12.5,
                  fontWeight: FontWeight.w700,
                  color: AuthColors.primary,
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 14),
        Text(
          'Create your TravelOra Account',
          style: GoogleFonts.plusJakartaSans(
            fontSize: 26,
            fontWeight: FontWeight.w800,
            height: 1.15,
            color: AuthColors.ink,
          ),
        ),
        const SizedBox(height: 10),
        Text(
          'Join verified expeditions, hold real-time hut allocations, and preserve your booking progress across devices.',
          style: GoogleFonts.plusJakartaSans(
            fontSize: 14.5,
            height: 1.4,
            color: AuthColors.ink.withAlpha(190),
          ),
        ),
      ],
    );
  }

  Widget _buildFields() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        AuthTextField(
          controller: _nameController,
          label: 'Full Legal Name',
          prefixIcon: Icons.badge_outlined,
          fillColor: Colors.white,
          borderColor: AuthColors.border,
          textCapitalization: TextCapitalization.words,
          textInputAction: TextInputAction.next,
          validator: AuthValidators.name,
          helperText: 'Matches trail manifest and park access permit ID',
        ),
        const SizedBox(height: 16),
        AuthTextField(
          controller: _emailController,
          label: 'Email Address',
          prefixIcon: Icons.mail_outline,
          fillColor: Colors.white,
          borderColor: AuthColors.border,
          keyboardType: TextInputType.emailAddress,
          textInputAction: TextInputAction.next,
          validator: AuthValidators.email,
        ),
        const SizedBox(height: 16),
        AuthTextField(
          controller: _passwordController,
          label: 'Password',
          prefixIcon: Icons.lock_outline,
          fillColor: Colors.white,
          borderColor: AuthColors.border,
          obscureText: _obscurePassword,
          textInputAction: TextInputAction.next,
          validator: AuthValidators.registerPassword,
          onChanged: (_) => setState(() {}),
          labelTrailing: Text(
            PasswordStrengthMeter(password: _passwordController.text).label,
            style: GoogleFonts.jetBrainsMono(
              fontSize: 11,
              fontWeight: FontWeight.w700,
              color: AuthColors.primary,
            ),
          ),
          suffix: IconButton(
            onPressed: () =>
                setState(() => _obscurePassword = !_obscurePassword),
            icon: Icon(
              _obscurePassword
                  ? Icons.visibility_outlined
                  : Icons.visibility_off_outlined,
              color: AuthColors.ink.withAlpha(200),
            ),
          ),
        ),
        PasswordStrengthMeter(password: _passwordController.text),
        const SizedBox(height: 16),
        _buildPhoneField(),
      ],
    );
  }

  Widget _buildPhoneField() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.only(bottom: 8),
          child: Text(
            'Mobile Phone (Emergency & Dispatch SMS)',
            style: GoogleFonts.plusJakartaSans(
              fontSize: 13,
              fontWeight: FontWeight.w500,
              color: AuthColors.ink.withAlpha(200),
            ),
          ),
        ),
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              height: 58,
              padding: const EdgeInsets.symmetric(horizontal: 12),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: AuthColors.border),
              ),
              child: DropdownButtonHideUnderline(
                child: DropdownButton<String>(
                  value: _countryCode,
                  icon: const Icon(Icons.keyboard_arrow_down, size: 20),
                  borderRadius: BorderRadius.circular(14),
                  items: [
                    for (final (flag, code) in _countryCodes)
                      DropdownMenuItem(
                        value: code,
                        child: Text(
                          '$flag  $code',
                          style: GoogleFonts.plusJakartaSans(
                            fontSize: 15,
                            fontWeight: FontWeight.w500,
                            color: AuthColors.ink,
                          ),
                        ),
                      ),
                  ],
                  onChanged: (value) {
                    if (value != null) setState(() => _countryCode = value);
                  },
                ),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: AuthTextField(
                controller: _phoneController,
                fillColor: Colors.white,
                borderColor: AuthColors.border,
                keyboardType: TextInputType.phone,
                textInputAction: TextInputAction.done,
                inputFormatters: [
                  FilteringTextInputFormatter.allow(RegExp(r'[0-9 ]')),
                ],
                validator: AuthValidators.optionalPhone,
              ),
            ),
          ],
        ),
        Padding(
          padding: const EdgeInsets.only(top: 6, left: 4),
          child: Text(
            'Critical for last-minute alpine trail deviations and hut arrival confirmations.',
            style: GoogleFonts.plusJakartaSans(
              fontSize: 12,
              color: AuthColors.muted,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildAgreements() {
    final base = GoogleFonts.plusJakartaSans(
      fontSize: 13.5,
      height: 1.4,
      color: AuthColors.ink.withAlpha(220),
    );
    final link = base.copyWith(
      fontWeight: FontWeight.w700,
      color: AuthColors.primary,
      decoration: TextDecoration.underline,
      decorationColor: AuthColors.primary,
    );

    return Column(
      children: [
        AuthCheckbox(
          value: _acceptedTerms,
          onChanged: (v) => setState(() => _acceptedTerms = v),
          child: Text.rich(
            TextSpan(
              style: base,
              children: [
                const TextSpan(text: 'I agree to the '),
                TextSpan(text: 'Terms of Service', style: link),
                const TextSpan(text: ' and verified '),
                TextSpan(text: 'Operator Manifest Policies', style: link),
                const TextSpan(text: '.'),
              ],
            ),
          ),
        ),
        const SizedBox(height: 12),
        AuthCheckbox(
          value: _wantsAlerts,
          onChanged: (v) => setState(() => _wantsAlerts = v),
          child: Text(
            'Send me real-time dispatch weather alerts, avalanche risk bulletins, and last-minute permit releases.',
            style: base,
          ),
        ),
      ],
    );
  }

  Widget _buildSubmit(BuildContext context) {
    return BlocConsumer<AuthCubit, AuthState>(
      listener: (context, state) {
        if (state is AuthFailure) {
          ScaffoldMessenger.of(context)
            ..hideCurrentSnackBar()
            ..showSnackBar(SnackBar(content: Text(state.message)));
        }

        if (state is AuthSuccess) {
          // The backend returns an access token with the 201, and AuthRepo has
          // already persisted it, so the user is signed in: go straight to the
          // shell instead of making them log in again.
          context.go('/home');
        }
      },
      builder: (context, state) {
        return AuthPrimaryButton(
          label: 'Create Account & Continue Booking',
          color: AuthColors.coral,
          isLoading: state is AuthLoading,
          onPressed: () => _register(context),
        );
      },
    );
  }

  Widget _buildFooter(BuildContext context) {
    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              'Already have an account? ',
              style: GoogleFonts.plusJakartaSans(
                fontSize: 14,
                color: AuthColors.ink.withAlpha(200),
              ),
            ),
            GestureDetector(
              onTap: () {
                context.pushReplacement('/login');
              },
              child: Text(
                'Sign In',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 14,
                  fontWeight: FontWeight.w800,
                  color: AuthColors.primary,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 14),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
          decoration: BoxDecoration(
            color: AuthColors.infoSurface,
            borderRadius: BorderRadius.circular(20),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(
                Icons.verified_user_outlined,
                size: 14,
                color: AuthColors.ink,
              ),
              const SizedBox(width: 6),
              Text(
                '100% data privacy Ã¢â‚¬Â¢ No payment required to register',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 11,
                  fontWeight: FontWeight.w600,
                  color: AuthColors.ink.withAlpha(210),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
