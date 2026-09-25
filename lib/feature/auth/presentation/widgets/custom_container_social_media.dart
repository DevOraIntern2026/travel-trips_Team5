import 'package:flutter/material.dart';

class CustomContainerSocialMedia extends StatelessWidget {
  const CustomContainerSocialMedia({
    super.key,
    // required this.image,
    required this.text,
  });
  // final String image;
  final String text;
  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        border: Border.all(width: 1, color: Colors.grey),
      ),
      child: Row(
        children: [
          Expanded(
            child: Center(
              child: Text(
                text,
                style: TextStyle(
                  fontSize: 16,
                  color: Colors.grey,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
