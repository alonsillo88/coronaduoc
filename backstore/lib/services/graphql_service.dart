import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

class GraphQLService {
  static ValueNotifier<GraphQLClient> client = ValueNotifier(
    GraphQLClient(
      link: HttpLink('http://localhost:3000/backstore'), // URL del servidor GraphQL
      cache: GraphQLCache(store: InMemoryStore()),  // Usamos memoria para cachear resultados
    ),
  );

  static ValueNotifier<GraphQLClient> getClient() {
    return client;
  }
}