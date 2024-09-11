import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class StaticCoronaLogo extends StatelessWidget {
  final double size;  // Tamaño ajustable
  final Color color;  // Color ajustable

  const StaticCoronaLogo({
    super.key, 
    this.size = 300, // Tamaño por defecto
    this.color = Colors.black, // Color por defecto
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: size, // Ajustar el tamaño según la propiedad size
      height: size * 0.3,
      child: FittedBox(
        fit: BoxFit.contain,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            _buildLetter('c.svg'), // Letra C
            const SizedBox(width: 10), // Padding entre las letras
            _buildLetter('o.svg'), // Primera O estática
            const SizedBox(width: 10), // Padding entre las letras
            _buildLetter('r.svg'), // Letra R
            const SizedBox(width: 10), // Padding entre las letras            
            _buildLetter('o2.svg'),// Segunda "O" estática
            const SizedBox(width: 10), // Padding entre las letras
            _buildLetter('n.svg'),  // Letra N
            const SizedBox(width: 10), // Padding entre las letras
            _buildLetter('a.svg'),  // Letra A
            Padding(
              padding: const EdgeInsets.only(bottom: 0),
              child: _buildLetter('registered.svg', height: 5), // Copyright
            ),
          ],
        ),
      ),
    );
  }

  // Función para construir cada letra, ajustando el color
  Widget _buildLetter(String assetName, {double? height}) {
    return SvgPicture.asset(
      'assets/svg/$assetName',
      height: height ?? size * 0.15,  // Ajustar la altura de la letra
      colorFilter: ColorFilter.mode(color, BlendMode.srcIn),  // Usar colorFilter en vez de color
    );
  }
}
