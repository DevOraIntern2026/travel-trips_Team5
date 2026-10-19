import 'package:flutter/material.dart';

import '../../../../../core/theme/app_colors.dart';
import '../../../../../core/widgets/app_state_buttons.dart';
import '../../../../../core/widgets/app_widgets.dart';

/// Matrix state 04 - request never reached the server.
/// Matrix state 04 — request never reached the server.
class NetworkSyncView extends StatelessWidget {
  const NetworkSyncView({
    super.key,
    required this.message,
    this.reference,
    this.summary,
    required this.onRetry,
    this.onSaveDraft,
  });

  final String message;
  final String? reference;
  final String? summary;
  final VoidCallback onRetry;
  final VoidCallback? onSaveDraft;

  @override
  Widget build(BuildContext context) {
    return AppCard(
      padding: const EdgeInsets.all(14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const Align(
            alignment: Alignment.centerLeft,
            child: AppPill(
              'NETWORK DISRUPTION • SYNC TIMEOUT',
              icon: Icons.wifi_off,
              mono: true,
              fontSize: 10.5,
            ),
          ),
          const SizedBox(height: 12),
          SoftBox(
            padding: const EdgeInsets.all(14),
            radius: 16,
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const AppIconBox(
                  Icons.wifi_off_rounded,
                  background: AppColors.bannerIconSurface,
                  size: 44,
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Live Manifest Sync Paused',
                        style: AppText.title(18),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        message,
                        style: AppText.body(13.5, AppColors.ink.withAlpha(200)),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          if (reference != null || summary != null) ...[
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppColors.infoSurface.withAlpha(110),
                borderRadius: BorderRadius.circular(14),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'HELD BOOKING SNAPSHOT',
                          style: AppText.mono(10.5, AppColors.muted),
                        ),
                        const SizedBox(height: 6),
                        if (reference != null)
                          Text(
                            reference!,
                            style: AppText.mono(
                              13,
                              AppColors.ink,
                              FontWeight.w700,
                            ),
                          ),
                        if (summary != null)
                          Text(
                            summary!,
                            style: AppText.body(12.5, AppColors.muted),
                          ),
                      ],
                    ),
                  ),
                  const AppPill(
                    'Locally Cached',
                    background: Colors.white,
                    foreground: AppColors.primary,
                  ),
                ],
              ),
            ),
          ],
          const SizedBox(height: 12),
          AppStateActionButton(
            label: 'Retry Connection Now',
            icon: Icons.sync,
            onPressed: onRetry,
          ),
          if (onSaveDraft != null) ...[
            const SizedBox(height: 8),
            AppStateSecondaryButton(
              label: 'Save Draft & Complete Later',
              icon: Icons.download_outlined,
              onPressed: onSaveDraft!,
            ),
          ],
        ],
      ),
    );
  }
}
