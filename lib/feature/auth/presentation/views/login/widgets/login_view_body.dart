import 'package:flutter/material.dart';

import 'package:travel_app/core/utils/app_routes.dart';
import 'package:travel_app/feature/auth/presentation/widgets/auth_prompt_row.dart';
import 'package:travel_app/feature/auth/presentation/widgets/custom_container_buttom.dart';
import 'package:travel_app/feature/auth/presentation/widgets/custom_container_social_media.dart';
import 'package:travel_app/feature/auth/presentation/widgets/custom_divider.dart';
import 'package:travel_app/feature/auth/presentation/widgets/custom_login_appbar.dart';
import 'package:travel_app/feature/auth/presentation/widgets/custom_text_form_field.dart';

class LoginViewBody extends StatefulWidget {
  const LoginViewBody({super.key});

  @override
  State<LoginViewBody> createState() => _LoginViewBodyState();
}

class _LoginViewBodyState extends State<LoginViewBody> {
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();

  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  @override
  void dispose() {
    emailController.dispose();
    passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(
        horizontal: 16.0,
        vertical: 12.0,
      ),
      child: SingleChildScrollView(
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              CustomLoginAppBar(
                text: 'تسجيل دخول',
              ),
              const SizedBox(height: 24),
              CustomTextFormField(
                controller: emailController,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter your email';
                  }

                  if (!value.contains('@')) {
                    return 'Please enter a valid email';
                  }

                  return null;
                },
                hintText: 'البريد الإلكتروني',
              ),
              const SizedBox(height: 16),
              CustomTextFormField(
                controller: passwordController,
                obscureText: true,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'من فضلك أدخل كلمة المرور';
                  }

                  if (value.length < 6) {
                    return 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
                  }

                  return null;
                },
                hintText: 'كلمة المرور',
              ),
              const SizedBox(height: 16),
              InkWell(
                onTap: () {
                  Navigator.push(
                    context,
                    AppRoute.forgetPassword,
                  );
                },
                child: const Align(
                  alignment: Alignment.centerLeft,
                  child: Text(
                    'نسيت كلمة المرور؟',
                  ),
                ),
              ),
              const SizedBox(height: 33),
              CustomContainerButtom(
                text: 'تسجيل دخول',
                onTap: () {
                  if (_formKey.currentState!.validate()) {
                    print(
                      'Email: ${emailController.text.trim()}',
                    );
                    print(
                      'Password: ${passwordController.text.trim()}',
                    );
                    Navigator.push(
                      context,
                      AppRoute.homeRoute,
                    );
                  }
                },
              ),
              const SizedBox(height: 33),
              AuthPromptRow(
                text: 'لاتمتلك حساب؟',
                buttom: 'قم بانشاء حساب',
                onTap: () {
                  Navigator.push(
                    context,
                    AppRoute.registerRoute,
                  );
                },
              ),
              const SizedBox(height: 49),
              const CustomDivider(),
              const SizedBox(height: 31),
              CustomContainerSocialMedia(
                text: 'تسجيل بواسطة جوجل',
              ),
              const SizedBox(height: 16),
              CustomContainerSocialMedia(
                text: 'تسجيل بواسطة أبل',
              ),
              const SizedBox(height: 16),
              CustomContainerSocialMedia(
                text: 'تسجيل بواسطة فيسبوك',
              ),
            ],
          ),
        ),
      ),
    );
  }
}