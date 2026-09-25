


import 'package:flutter/material.dart';

class TermsAndConditions extends StatefulWidget {
  const TermsAndConditions({super.key});

  @override
  State<TermsAndConditions> createState() => _TermsAndConditionsState();
}

class _TermsAndConditionsState extends State<TermsAndConditions> {
  bool isChecked = false;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 16),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Transform.scale(
            scale: 1.3,
            child: Checkbox(
              value: isChecked,
              onChanged: (value) {
                setState(() {
                  isChecked = value!;
                });
              },
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(4),
              ),
              side: const BorderSide(color: Colors.grey, width: 2),
              activeColor: Colors.green,
            ),
          ),
          SizedBox(width: 16),
          Expanded(
            child: RichText(
              textAlign: TextAlign.right,
              text: TextSpan(
                children: const [
                  TextSpan(
                    text: 'من خلال إنشاء حساب، فإنك توافق على ',
                    style:
                    TextStyle(fontSize: 13,fontWeight: FontWeight.w400,color: Colors.grey),
                    
                  ),
                  TextSpan(
                    text: 'الشروط \nوالأحكام الخاصة بنا',
                    style: TextStyle(fontSize: 13,fontWeight: FontWeight.w400,color: Colors.green),
                    
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
