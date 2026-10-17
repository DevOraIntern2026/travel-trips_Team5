import '../../domain/entities/destination.dart';
import '../../domain/entities/trip.dart';

class TripImageResolver {
  const TripImageResolver._();

  static const _dolomites = 'assets/imgs/Dolomites & Northern Italy.jpg';
  static const _patagonia = 'assets/imgs/Patagonia & Los Glaciares.avif';
  static const _swiss = 'assets/imgs/Swiss Alps & Matterhorn.webp';
  static const _iceland = 'assets/imgs/Icelandic Highlands & Geysers.webp';
  static const _kyoto = 'assets/imgs/Kyoto & Kumano Kodo.jpg';
  static const _amalfi = 'assets/imgs/Amalfi Coast.jpg';
  static const _annapurna = 'assets/imgs/Annapurna Circuit.jpg';
  static const _atlas = 'assets/imgs/Atlas Mountains & Berber Villages.webp';
  static const _newZealand = 'assets/imgs/New Zealand Southern Alps.jpg';
  static const _peru = 'assets/imgs/Peru & the Sacred Valley.webp';

  static String? forTrip(Trip trip) {
    final text = '${trip.name} ${trip.destination?.name ?? ''}'.toLowerCase();
    if (_contains(text, ['dolomit', 'tre cime', 'brenta'])) {
      return _dolomites;
    }
    if (_contains(text, ['patagonia', 'los glaciares', 'fitz roy'])) {
      return _patagonia;
    }
    if (_contains(text, ['matterhorn', 'zermatt', 'mont blanc', 'swiss'])) {
      return _swiss;
    }
    if (_contains(text, ['iceland', 'laugavegur', 'geysers'])) {
      return _iceland;
    }
    if (_contains(text, ['kyoto', 'kumano'])) {
      return _kyoto;
    }
    if (_contains(text, ['amalfi'])) {
      return _amalfi;
    }
    if (_contains(text, ['annapurna'])) {
      return _annapurna;
    }
    if (_contains(text, ['atlas mountains', 'berber'])) {
      return _atlas;
    }
    if (_contains(text, ['new zealand', 'southern alps'])) {
      return _newZealand;
    }
    if (_contains(text, ['peru', 'sacred valley'])) {
      return _peru;
    }
    return null;
  }

  static String? forDestination(Destination destination) {
    final text =
        '${destination.name} ${destination.city} ${destination.country}'
            .toLowerCase();
    if (_contains(text, ['dolomit', 'italy'])) {
      return _dolomites;
    }
    if (_contains(text, ['patagonia', 'glaciares', 'argentina'])) {
      return _patagonia;
    }
    if (_contains(text, [
      'swiss',
      'french alps',
      'matterhorn',
      'zermatt',
      'mont blanc',
    ])) {
      return _swiss;
    }
    if (_contains(text, ['iceland', 'highlands'])) {
      return _iceland;
    }
    if (_contains(text, ['kyoto', 'kumano', 'japan'])) {
      return _kyoto;
    }
    if (_contains(text, ['amalfi'])) {
      return _amalfi;
    }
    if (_contains(text, ['annapurna', 'nepal'])) {
      return _annapurna;
    }
    if (_contains(text, ['atlas mountains', 'berber', 'morocco'])) {
      return _atlas;
    }
    if (_contains(text, ['new zealand', 'southern alps'])) {
      return _newZealand;
    }
    if (_contains(text, ['peru', 'sacred valley'])) {
      return _peru;
    }
    return null;
  }

  static bool _contains(String text, List<String> terms) =>
      terms.any(text.contains);
}
