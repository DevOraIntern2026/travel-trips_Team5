
import 'package:flutter/material.dart';

class CustomTextFormField extends StatelessWidget {
  final String hintText;
  final TextInputType? keyboardType;
  final Widget? suffixIcon;
  final bool obscureText;
  final TextEditingController? controller;
  final String? Function(String?)? validator;
  

  const CustomTextFormField({
    super.key,
    required this.hintText,
    this.keyboardType,
    this.suffixIcon,
    this.obscureText = false, this.controller, this.validator,
  });

  @override
  Widget build(BuildContext context) {
    return TextFormField(
     controller: controller,
     validator: validator,
      keyboardType: keyboardType,
      obscureText: obscureText,
      textAlign: TextAlign.right,
      decoration: InputDecoration(
        hintText: hintText,
        // hintStyle: 
        // AppStyle.grey13SemiBold.copyWith(
        //   fontWeight: FontWeight.w700,
        // ),
        suffixIcon: suffixIcon,

        filled: true,
        fillColor: Colors.grey,

        border: buildBorder(),

        enabledBorder: buildBorder(),

        focusedBorder: buildBorder(),
      ),
    );
  }

  OutlineInputBorder buildBorder({Color color = Colors.grey}) {
    return OutlineInputBorder(
      borderRadius: BorderRadius.circular(4),
      borderSide: BorderSide(color: color, width: 1),
    );
  }
}
