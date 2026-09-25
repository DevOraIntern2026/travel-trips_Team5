import 'package:flutter/material.dart';

class CustomLoginAppBar extends StatelessWidget {
  const CustomLoginAppBar({super.key, required this.text, this.onPressed});
  final String text;
  final Function()? onPressed;
  @override
  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 44,
      child: Stack(
        children: [
          Center(
            child: Text(
              text,
              style: TextStyle(
                fontSize: 19,
                fontWeight: FontWeight.bold,
                color: Colors.grey,
              ),
            ),
          ),

          Positioned(
            right: 0,
            child: CircleAvatar(
              radius: 22,
              backgroundColor: Colors.white,
              child: IconButton(
                onPressed: onPressed,
                icon: Icon(
                  Icons.arrow_back_ios_new,
                  color: Colors.blueGrey,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
