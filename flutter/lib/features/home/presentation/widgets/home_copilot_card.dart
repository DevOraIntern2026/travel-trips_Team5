import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/app_widgets.dart';

class HomeCopilotCard extends StatelessWidget {
  const HomeCopilotCard({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(24),
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFF1F5E5F), AppColors.primary, Color(0xFF0A2C2E)],
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 10,
                  vertical: 6,
                ),
                decoration: BoxDecoration(
                  color: Colors.white.withAlpha(25),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(
                      Icons.auto_awesome,
                      size: 14,
                      color: Color(0xFF7CC7FF),
                    ),
                    const SizedBox(width: 6),
                    Text(
                      'TRAVELORA AI COPILOT',
                      style: AppText.mono(
                        10.5,
                        const Color(0xFF7CC7FF),
                        FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ),
              Icon(
                Icons.smart_toy_outlined,
                color: Colors.white.withAlpha(110),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            'Need trip inspiration based on your dates?',
            style: AppText.title(22, Colors.white),
          ),
          const SizedBox(height: 8),
          Text(
            'Ask our assistant for curated routes with guaranteed open seats.',
            style: AppText.body(13.5, Colors.white.withAlpha(170)),
          ),
          const SizedBox(height: 18),
          FilledButton(
            onPressed: () {
              // TODO: open AI assistant
            },
            style: FilledButton.styleFrom(
              backgroundColor: Colors.white,
              foregroundColor: AppColors.rust,
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(30),
              ),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  'Chat with Assistant',
                  style: AppText.label(14.5, AppColors.rust),
                ),
                const SizedBox(width: 8),
                const Icon(Icons.arrow_forward, size: 18),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
