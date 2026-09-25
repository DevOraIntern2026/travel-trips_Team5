
import 'package:flutter/material.dart';

class CustomContainerButtom extends StatelessWidget {
  const CustomContainerButtom({super.key, required this.text, this.onTap});
  final String text;
  final Function()? onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      child: Container(
        width: double.infinity,

        decoration: ShapeDecoration(
          color: Colors.green,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
        ),
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 12),
          child: Center(
            child: Text(
              text,
              textAlign: TextAlign.center,
              
              style:TextStyle(fontSize: 16,fontWeight: FontWeight.bold,color: Colors.white)
              
             
            ),
          ),
        ),
      ),
    );
  }
}
