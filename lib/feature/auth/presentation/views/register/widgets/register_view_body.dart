import 'package:flutter/material.dart';
import 'package:travel_app/core/utils/app_routes.dart';
import 'package:travel_app/feature/auth/presentation/views/register/widgets/trimes_and_conditions.dart';
import 'package:travel_app/feature/auth/presentation/widgets/auth_prompt_row.dart';
import 'package:travel_app/feature/auth/presentation/widgets/custom_container_buttom.dart';
import 'package:travel_app/feature/auth/presentation/widgets/custom_login_appbar.dart';
import 'package:travel_app/feature/auth/presentation/widgets/custom_text_form_field.dart';

class RegisterViewBody extends StatefulWidget {
  const RegisterViewBody({super.key});

  @override
  State<RegisterViewBody> createState() => _RegisterViewBodyState();
}

class _RegisterViewBodyState extends State<RegisterViewBody> {
  final TextEditingController nameController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  final TextEditingController emailController = TextEditingController();
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  @override
  void dispose() {
    nameController.dispose();
    emailController.dispose();
    passwordController.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: SingleChildScrollView(
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              CustomLoginAppBar(text: 'حساب جديد'),
              SizedBox(height: 28),
              CustomTextFormField(
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter your name';
                  }
                  return null;
                },
                hintText: 'الاسم كامل',
                controller: nameController,
              ),
              SizedBox(height: 16),
              CustomTextFormField(
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter your email';
                  }
                  if (!value.contains('@')) {
                    return 'Please enter your email';
                  }
                  return null;
                },
                hintText: 'البريد الإلكتروني',
                controller: emailController,
              ),
              SizedBox(height: 16),
              CustomTextFormField(
                controller: passwordController,

                hintText: 'كلمة المرور',
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'من فضلك أدخل  كلمة المرور';
                  }
                  if (value.length < 6) {
                   return 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
                  }
                  return null;
                },
                obscureText: true,
                suffixIcon: Padding(
                  padding: const EdgeInsets.all(14),
                  child: Icon(Icons.visibility),
                ),
              ),
              TermsAndConditions(),
              SizedBox(height: 30),
              CustomContainerButtom(
                text: 'إنشاء حساب جديد',
                onTap: () {
                  if (_formKey.currentState!.validate()) {
                    print('Name: ${nameController.text.trim()}');
                    print('Email: ${emailController.text.trim()}');
                    print('Password: ${passwordController.text.trim()}');

                    Navigator.push(context, AppRoute.homeRoute);
                  }
                },
              ),
              SizedBox(height: 26),
              AuthPromptRow(
                text: 'تمتلك حساب بالفعل؟',
                buttom: 'تسجيل دخول',
                onTap: () {
                  Navigator.push(context, AppRoute.loginRoute);
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
