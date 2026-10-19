import '../../domain/entities/paginated_result.dart';
import 'json_utils.dart';

class PaginatedResponseModel<T> extends PaginatedResult<T> {
  const PaginatedResponseModel({
    required super.data,
    required super.page,
    required super.limit,
    required super.total,
    required super.totalPages,
  });

  factory PaginatedResponseModel.fromJson(
    JsonMap json,
    T Function(JsonMap) parseItem,
  ) {
    final meta = jsonMap(json['meta']);
    return PaginatedResponseModel<T>(
      data: jsonList(json['data'], parseItem),
      page: requiredInt(meta, 'page'),
      limit: requiredInt(meta, 'limit'),
      total: requiredInt(meta, 'total'),
      totalPages: requiredInt(meta, 'totalPages'),
    );
  }
}
