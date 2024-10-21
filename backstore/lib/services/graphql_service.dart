import 'dart:io';

import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:shared_preferences/shared_preferences.dart';

class GraphQLService {
  static late final ValueNotifier<GraphQLClient> client;

  static Future<void> initialize() async {
    await initHiveForFlutter();
    final prefs = await SharedPreferences.getInstance();
    final String? accessToken = prefs.getString('accessToken');

    final String backendUrl = Platform.isAndroid
        ? 'http://10.0.2.2:3000/backstore'
        : 'http://localhost:3000/backstore';

    final link = AuthLink(getToken: () => 'Bearer $accessToken')
        .concat(HttpLink(backendUrl));

    client = ValueNotifier(
      GraphQLClient(
        link: link,
        cache: GraphQLCache(store: HiveStore()),
      ),
    );

    debugPrint('GraphQL client inicializado con accessToken: $accessToken');
  }
}
