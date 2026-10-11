import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../auth/presentation/theme/auth_colors.dart';
import '../../../auth/presentation/ui/login_screen.dart';
import '../../../home/presentation/ui/home_screen.dart';
import '../../../auth/presentation/widgets/auth_buttons.dart';
import '../../../auth/presentation/widgets/travelora_logo.dart';

class FeaturedTrip {
  const FeaturedTrip({
    required this.title,
    required this.subtitle,
    this.tag = 'CURATED ROUTES',
    this.image,
    this.liveCount,
  });

  final String title;
  final String subtitle;
  final String tag;
  final ImageProvider? image;
  final String? liveCount;
}

class OnboardingScreen extends StatelessWidget {
  const OnboardingScreen({super.key, this.featuredTrip, this.onExploreTrips});

  final FeaturedTrip? featuredTrip;
  final VoidCallback? onExploreTrips;

  void _openLogin(BuildContext context) {
    Navigator.of(
      context,
    ).push(MaterialPageRoute<void>(builder: (_) => const LoginScreen()));
  }

  void _openTrips(BuildContext context) {
    Navigator.of(
      context,
    ).push(MaterialPageRoute<void>(builder: (_) => const HomeScreen()));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AuthColors.background,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(16, 12, 16, 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildTopRow(),
              const SizedBox(height: 18),
              _HeroCard(trip: featuredTrip),
              const SizedBox(height: 24),
              Text(
                'Discover authentic journeys, book verified seats with confidence.',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 30,
                  fontWeight: FontWeight.w800,
                  height: 1.15,
                  color: AuthColors.ink,
                ),
              ),
              const SizedBox(height: 12),
              Text(
                'Explore handpicked group tours and expeditions. Transparent pricing, live operator availability, zero hidden fees.',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 15,
                  height: 1.45,
                  color: AuthColors.ink.withAlpha(200),
                ),
              ),
              const SizedBox(height: 20),
              const _FeatureTile(
                icon: Icons.airline_seat_recline_normal,
                title: 'Live Seat Availability',
                subtitle: 'Synced directly with verified operator manifests',
              ),
              const SizedBox(height: 10),
              const _FeatureTile(
                icon: Icons.handshake_outlined,
                title: 'Direct Operator Booking',
                subtitle:
                    'True fair rates with no third-party middleman markups',
              ),
              const SizedBox(height: 10),
              const _FeatureTile(
                icon: Icons.explore_outlined,
                title: 'AI Journey Assistant',
                subtitle: 'Tailored itinerary and pace matching for travelers',
              ),
              const SizedBox(height: 24),
              AuthPrimaryButton(
                label: 'Explore Trips',
                onPressed: onExploreTrips ?? () => _openTrips(context),
              ),
              const SizedBox(height: 12),
              SizedBox(
                width: double.infinity,
                height: 52,
                child: FilledButton(
                  onPressed: () => _openLogin(context),
                  style: FilledButton.styleFrom(
                    backgroundColor: AppColors.bannerSurface,
                    foregroundColor: AuthColors.primary,
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.login, size: 18),
                      const SizedBox(width: 8),
                      Text(
                        'Already have a booking? Sign In',
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 14.5,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Center(
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(
                      Icons.check_circle_outline,
                      size: 15,
                      color: AuthColors.success,
                    ),
                    const SizedBox(width: 6),
                    Text(
                      'No account required to browse trips and check dates',
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 12,
                        color: AuthColors.ink.withAlpha(200),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTopRow() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        const TravelOraCompactLogo(badgeSize: 40, wordSize: 19),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          decoration: BoxDecoration(
            color: AuthColors.infoSurface,
            borderRadius: BorderRadius.circular(20),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 8,
                height: 8,
                decoration: const BoxDecoration(
                  color: AuthColors.primary,
                  shape: BoxShape.circle,
                ),
              ),
              const SizedBox(width: 8),
              Text(
                'Global Expeditions',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 12,
                  fontWeight: FontWeight.w700,
                  color: AuthColors.ink,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _HeroCard extends StatelessWidget {
  const _HeroCard({this.trip});

  final FeaturedTrip? trip;

  @override
  Widget build(BuildContext context) {
    final trip = this.trip;

    return ClipRRect(
      borderRadius: BorderRadius.circular(22),
      child: SizedBox(
        height: 224,
        width: double.infinity,
        child: Stack(
          fit: StackFit.expand,
          children: [
            if (trip?.image != null)
              Image(image: trip!.image!, fit: BoxFit.cover)
            else
              const DecoratedBox(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [Color(0xFF2B5F63), AuthColors.primary],
                  ),
                ),
              ),
            const DecoratedBox(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [Color(0x00000000), Color(0xB3000000)],
                  stops: [0.35, 1.0],
                ),
              ),
            ),
            Positioned(
              top: 14,
              left: 14,
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 8,
                ),
                decoration: BoxDecoration(
                  color: Colors.white.withAlpha(235),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(
                      Icons.verified,
                      size: 16,
                      color: AuthColors.primary,
                    ),
                    const SizedBox(width: 6),
                    Text(
                      'Real-Time Verified Seats',
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                        color: AuthColors.ink,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            if (trip?.liveCount != null)
              Positioned(
                top: 14,
                right: 14,
                child: Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 10,
                    vertical: 7,
                  ),
                  decoration: BoxDecoration(
                    color: AuthColors.navy.withAlpha(215),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(
                        Icons.flight,
                        size: 14,
                        color: AuthColors.coral,
                      ),
                      const SizedBox(width: 6),
                      Text(
                        '${trip!.liveCount} Live',
                        style: GoogleFonts.jetBrainsMono(
                          fontSize: 11.5,
                          fontWeight: FontWeight.w700,
                          color: Colors.white,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            if (trip != null)
              Positioned(
                left: 16,
                right: 16,
                bottom: 16,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 10,
                        vertical: 5,
                      ),
                      decoration: BoxDecoration(
                        color: const Color(0xFFE8613F),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        trip.tag,
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 11,
                          fontWeight: FontWeight.w800,
                          letterSpacing: 0.4,
                          color: Colors.white,
                        ),
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      trip.title,
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 21,
                        fontWeight: FontWeight.w800,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      trip.subtitle,
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 13,
                        color: Colors.white.withAlpha(215),
                      ),
                    ),
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }
}

class _FeatureTile extends StatelessWidget {
  const _FeatureTile({
    required this.icon,
    required this.title,
    required this.subtitle,
  });

  final IconData icon;
  final String title;
  final String subtitle;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
      ),
      child: Row(
        children: [
          Container(
            width: 42,
            height: 42,
            decoration: BoxDecoration(
              color: AuthColors.infoSurface,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, size: 22, color: AuthColors.primary),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 15,
                    fontWeight: FontWeight.w800,
                    color: AuthColors.ink,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  subtitle,
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 12.5,
                    height: 1.3,
                    color: AuthColors.ink.withAlpha(190),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
