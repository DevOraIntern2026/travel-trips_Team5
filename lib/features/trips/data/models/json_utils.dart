typedef JsonMap = Map<String, Object?>;

JsonMap jsonMap(Object? value) {
  if (value is! Map) {
    throw const FormatException('Expected a JSON object.');
  }

  return value.map<String, Object?>((key, item) {
    if (key is! String) {
      throw const FormatException('Expected JSON object keys to be text.');
    }
    return MapEntry(key, item);
  });
}

List<T> jsonList<T>(Object? value, T Function(JsonMap) parseItem) {
  if (value is! List) {
    throw const FormatException('Expected a JSON array.');
  }
  return value.map((item) => parseItem(jsonMap(item))).toList(growable: false);
}

int requiredInt(JsonMap json, String key) {
  final value = json[key];
  if (value is int) return value;
  if (value is num && value == value.toInt()) return value.toInt();
  throw FormatException('Expected "$key" to be an integer.');
}

double requiredDouble(JsonMap json, String key) {
  final value = json[key];
  if (value is num) return value.toDouble();
  throw FormatException('Expected "$key" to be a number.');
}

String requiredString(JsonMap json, String key) {
  final value = json[key];
  if (value is String) return value;
  throw FormatException('Expected "$key" to be text.');
}

String? nullableString(JsonMap json, String key) {
  final value = json[key];
  if (value == null || value is String) return value as String?;
  throw FormatException('Expected "$key" to be text or null.');
}

int? nullableInt(JsonMap json, String key) {
  final value = json[key];
  if (value == null) return null;
  if (value is int) return value;
  if (value is num && value == value.toInt()) return value.toInt();
  throw FormatException('Expected "$key" to be an integer or null.');
}

bool requiredBool(JsonMap json, String key) {
  final value = json[key];
  if (value is bool) return value;
  throw FormatException('Expected "$key" to be a boolean.');
}

DateTime requiredDateTime(JsonMap json, String key) {
  final value = requiredString(json, key);
  try {
    return DateTime.parse(value);
  } on FormatException {
    throw FormatException('Expected "$key" to be an ISO-8601 date.');
  }
}
