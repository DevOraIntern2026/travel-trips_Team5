import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../core/di/service_locator.dart';
import '../../../main/presentation/ui/main_shell.dart';
import '../cubit/auth_cubit.dart';
import '../cubit/auth_state.dart';
import '../theme/auth_colors.dart';
import '../utils/auth_validators.dart';
import '../widgets/auth_buttons.dart';
import '../widgets/auth_form_widgets.dart';
import '../widgets/auth_text_field.dart';
import '../widgets/auth_top_bar.dart';
import '../widgets/travelora_logo.dart';
import 'register_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  bool _obscurePassword = true;
  bool _emailValid = false;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  // Takes the context that sits BELOW the BlocProvider.
  void _login(BuildContext context) {
    if (!_formKey.currentState!.validate()) return;

    context.read<AuthCubit>().login(
      email: _emailController.text,
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
                  const AuthTopBar(
                    eyebrow: 'RESERVATION FLOW',
                    title: 'Sign In',
                    showLock: true,
                  ),
                  Expanded(
                    child: SingleChildScrollView(
                      padding: const EdgeInsets.fromLTRB(16, 16, 16, 24),
                      child: Column(
                        children: [
                          _buildFormCard(context),
                          const SizedBox(height: 16),
                          _buildGuestCard(),
                          const SizedBox(height: 20),
                          _buildFooter(),
                        ],
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

  Widget _buildFormCard(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(16, 20, 16, 20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: AuthColors.primary.withAlpha(14),
            blurRadius: 24,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Form(
        key: _formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Center(
              child: TravelOraCompactLogo(badgeSize: 36, wordSize: 17),
            ),
            const SizedBox(height: 16),
            Text(
              'Sign in to reserve your trip',
              textAlign: TextAlign.center,
              style: GoogleFonts.plusJakartaSans(
                fontSize: 22,
                fontWeight: FontWeight.w800,
                color: AuthColors.ink,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Sign in or create an account so we can link your booking and send real-time confirmation.',
              textAlign: TextAlign.center,
              style: GoogleFonts.plusJakartaSans(
                fontSize: 13,
                height: 1.4,
                color: AuthColors.muted,
              ),
            ),
            const SizedBox(height: 20),
            AuthSocialButton.google(
              label: 'Continue with Google',
              onPressed: () {
                // TODO: Google sign-in
              },
            ),
            const SizedBox(height: 10),
            AuthSocialButton.apple(
              label: 'Continue with Apple',
              onPressed: () {
                // TODO: Apple sign-in
              },
            ),
            const SizedBox(height: 18),
            const AuthOrDivider(label: 'OR SIGN IN WITH EMAIL'),
            const SizedBox(height: 16),
            AuthTextField(
              controller: _emailController,
              label: 'Email Address',
              hint: 'name@example.com',
              keyboardType: TextInputType.emailAddress,
              textInputAction: TextInputAction.next,
              validator: AuthValidators.email,
              onChanged: (value) {
                final valid = AuthValidators.isEmail(value);
                if (valid != _emailValid) setState(() => _emailValid = valid);
              },
              suffix: _emailValid
                  ? const Icon(
                      Icons.check_circle,
                      color: AuthColors.primary,
                      size: 22,
                    )
                  : null,
            ),
            const SizedBox(height: 16),
            AuthTextField(
              controller: _passwordController,
              label: 'Password',
              hint: 'Enter your password',
              obscureText: _obscurePassword,
              textInputAction: TextInputAction.done,
              validator: AuthValidators.loginPassword,
              onFieldSubmitted: (_) => _login(context),
              labelTrailing: GestureDetector(
                onTap: () {
                  // TODO: forgot password
                },
                child: Text(
                  'Forgot password?',
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 12,
                    fontWeight: FontWeight.w700,
                    color: AuthColors.primary,
                  ),
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
            const SizedBox(height: 22),
            BlocConsumer<AuthCubit, AuthState>(
              listener: (context, state) {
                if (state is AuthFailure) {
                  ScaffoldMessenger.of(context)
                    ..hideCurrentSnackBar()
                    ..showSnackBar(SnackBar(content: Text(state.message)));
                }

                if (state is AuthSuccess) {
                  Navigator.of(context).pushAndRemoveUntil(
                    MaterialPageRoute<void>(builder: (_) => const MainShell()),
                    (route) => false,
                  );
                }
              },
              builder: (context, state) {
                return AuthPrimaryButton(
                  label: 'Sign In & Continue Booking',
                  isLoading: state is AuthLoading,
                  onPressed: () => _login(context),
                );
              },
            ),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  "Don't have an account? ",
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 13,
                    color: AuthColors.ink.withAlpha(200),
                  ),
                ),
                GestureDetector(
                  onTap: () {
                    Navigator.of(context).push(
                      MaterialPageRoute<void>(
                        builder: (_) => const RegisterScreen(),
                      ),
                    );
                  },
                  child: Text(
                    'Create an account',
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 13,
                      fontWeight: FontWeight.w700,
                      color: AuthColors.primary,
                      decoration: TextDecoration.underline,
                      decorationColor: AuthColors.primary,
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildGuestCard() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AuthColors.infoSurface,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(
                  Icons.person_outline,
                  color: AuthColors.primary,
                  size: 22,
                ),
              ),
              const SizedBox(width: 12),
              Text(
                'Continue as Guest',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 17,
                  fontWeight: FontWeight.w800,
                  color: AuthColors.ink,
                ),
              ),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 10,
                  vertical: 4,
                ),
                decoration: BoxDecoration(
                  color: AuthColors.mint,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  'Fast Track',
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    color: AuthColors.primary,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Text(
            'Book without a password using just your contact details. You can easily set up an account later to manage check-in.',
            style: GoogleFonts.plusJakartaSans(
              fontSize: 13,
              height: 1.4,
              color: AuthColors.ink.withAlpha(190),
            ),
          ),
          const SizedBox(height: 14),
          SizedBox(
            width: double.infinity,
            height: 48,
            child: FilledButton(
              onPressed: () {
                // TODO: guest checkout
              },
              style: FilledButton.styleFrom(
                backgroundColor: Colors.white,
                foregroundColor: AuthColors.primary,
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    'Proceed with Guest Email',
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  const SizedBox(width: 6),
                  const Icon(Icons.chevron_right, size: 20),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFooter() {
    Widget item(IconData icon, String text) {
      return Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: AuthColors.ink.withAlpha(200)),
          const SizedBox(width: 4),
          Text(
            text,
            style: GoogleFonts.plusJakartaSans(
              fontSize: 11.5,
              fontWeight: FontWeight.w600,
              color: AuthColors.ink.withAlpha(200),
            ),
          ),
        ],
      );
    }

    return Column(
      children: [
        Wrap(
          alignment: WrapAlignment.center,
          spacing: 14,
          runSpacing: 6,
          children: [
            item(Icons.verified_user_outlined, '256-bit encrypted'),
            item(Icons.sync, 'Direct operator sync'),
            item(Icons.mark_email_read_outlined, 'No spam guarantee'),
          ],
        ),
        const SizedBox(height: 12),
        Text(
          "By continuing, you agree to TravelOra's Terms of Booking and Traveler Privacy Policy.",
          textAlign: TextAlign.center,
          style: GoogleFonts.plusJakartaSans(
            fontSize: 12,
            height: 1.4,
            color: AuthColors.muted,
          ),
        ),
      ],
    );
  }
}
