import 'package:flutter/material.dart';

import '../../domain/entities/trip_date.dart';

class TripDateCard extends StatelessWidget {
  const TripDateCard({
    super.key,
    required this.tripDate,
    required this.selected,
    required this.onTap,
  });

  final TripDate tripDate;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;
    final borderColor = selected ? colors.primary : colors.outlineVariant;

    return Card(
      clipBehavior: Clip.antiAlias,
      elevation: 0,
      color: selected ? colors.primaryContainer.withValues(alpha: 0.35) : colors.surface,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(color: borderColor, width: selected ? 1.5 : 1),
      ),
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              Icon(Icons.calendar_month_outlined, color: colors.primary),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      _formatRange(context, tripDate.startDate, tripDate.endDate),
                      style: Theme.of(context).textTheme.titleSmall?.copyWith(
                            fontWeight: FontWeight.w700,
                          ),
                    ),
                    const SizedBox(height: 4),
                    Text('Capacity: ${tripDate.capacity}'),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(
                    tripDate.price.toStringAsFixed(2),
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                          color: colors.primary,
                          fontWeight: FontWeight.w700,
                        ),
                  ),
                  Text('Price', style: Theme.of(context).textTheme.labelSmall),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  String _formatRange(BuildContext context, DateTime start, DateTime end) {
    final dateFormat = MaterialLocalizations.of(context).formatMediumDate;
    return '${dateFormat(start.toLocal())} – ${dateFormat(end.toLocal())}';
  }
}
