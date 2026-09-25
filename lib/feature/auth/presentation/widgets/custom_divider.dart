
import 'package:flutter/material.dart';

class CustomDivider extends StatelessWidget {
  const CustomDivider({super.key});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 6),
            child: Divider(color: Colors.grey, thickness: 2),
          ),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 10),
          child: Text(
            'أو',
            style:
            
            TextStyle(color: Colors.grey,fontSize: 16,fontWeight: FontWeight.bold)
          ),
        ),
        Expanded(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 6),
            child: Divider(color:Colors.grey, thickness: 2),
          ),
        ),
      ],
    );
  }
}
