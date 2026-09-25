import 'package:flutter/material.dart';
import 'package:travel_app/feature/auth/presentation/widgets/custom_container_buttom.dart';
import 'package:travel_app/feature/auth/presentation/widgets/custom_login_appbar.dart';
import 'package:travel_app/feature/auth/presentation/widgets/custom_text_form_field.dart';

class ForgetPasswordViewBody extends StatefulWidget {
  const ForgetPasswordViewBody({super.key});

  @override
  State<ForgetPasswordViewBody> createState() =>
      _ForgetPasswordViewBodyState();
}

class _ForgetPasswordViewBodyState extends State<ForgetPasswordViewBody> {
  final TextEditingController phoneController = TextEditingController();

  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  @override
  void dispose() {
    phoneController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: SingleChildScrollView(
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.start,
            children: [
              CustomLoginAppBar(
                text: 'نسيان كلمة المرور',
              ),

              const SizedBox(height: 28),

              const Text(
                'لا تقلق ، ما عليك سوى كتابة رقم هاتفك وسنرسل رمز التحقق.',
                textAlign: TextAlign.right,
                maxLines: 2,
                style: TextStyle(
                  color: Colors.grey,
                  fontWeight: FontWeight.w400,
                  fontSize: 16,
                ),
              ),

              const SizedBox(height: 31),

              CustomTextFormField(
                hintText: 'ادخل رقم هاتفك',
                controller: phoneController,
                keyboardType: TextInputType.phone,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'من فضلك أدخل رقم هاتفك';
                  }

                  if (value.length != 11) {
                    return 'رقم الهاتف يجب أن يكون 11 رقم';
                  }

                  return null;
                },
              ),

              const SizedBox(height: 31),

              CustomContainerButtom(
                text: 'نسيت كلمة المرور',
                onTap: () {
                  if (_formKey.currentState!.validate()) {
                    print(phoneController.text.trim());
                  }
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}