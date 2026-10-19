sealed class Failure {
  const Failure(this.message);

  final String message;
}

final class NetworkFailure extends Failure {
  const NetworkFailure([super.message = 'Unable to connect to the server.']);
}

final class ValidationFailure extends Failure {
  const ValidationFailure([super.message = 'The request was not valid.']);
}

final class NotFoundFailure extends Failure {
  const NotFoundFailure([super.message = 'The requested item was not found.']);
}

final class AuthorizationFailure extends Failure {
  const AuthorizationFailure([
    super.message = 'The request is not authorized.',
  ]);
}

final class ServerFailure extends Failure {
  const ServerFailure([
    super.message = 'The server could not complete the request.',
  ]);
}

final class DataParsingFailure extends Failure {
  const DataParsingFailure([
    super.message = 'The server returned invalid data.',
  ]);
}

final class UnexpectedFailure extends Failure {
  const UnexpectedFailure([super.message = 'An unexpected error occurred.']);
}
