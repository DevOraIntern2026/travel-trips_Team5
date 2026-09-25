
import 'package:flutter/material.dart';

class AuthPromptRow extends StatelessWidget {
  const AuthPromptRow({super.key, required this.text, required this.buttom, this.onTap});
  final String text, buttom;
  final Function()? onTap;
  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text(text, style:
        TextStyle(fontSize: 16,fontWeight: FontWeight.w500,color: Colors.grey)
        ),
        InkWell(
          onTap: onTap,
          child: Text(
            buttom,
            style:TextStyle(fontSize: 16,fontWeight: FontWeight.w500,color: Colors.grey)
          ),
        ),
      ],
    );
  }
}
