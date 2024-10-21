import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class AnimatedCoronaLogo extends StatefulWidget {
  final double size;  // Tamaño ajustable
  final Color color;  // Color ajustable

  const AnimatedCoronaLogo({
    super.key,
    this.size = 300, // Tamaño por defecto
    this.color = Colors.black, // Color por defecto
  });

  @override
  AnimatedCoronaLogoState createState() => AnimatedCoronaLogoState();
}

class AnimatedCoronaLogoState extends State<AnimatedCoronaLogo> with SingleTickerProviderStateMixin {
  late final AnimationController _controller = AnimationController(
    duration: const Duration(seconds: 1), // Duración de la animación completa
    vsync: this,
  )..repeat();  // Repetir la animación de forma continua

  late final Animation<double> _animation = Tween<double>(begin: -45, end: -90).animate(_controller);

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: widget.size, // Ajustar el tamaño según la propiedad size
      height: widget.size * 0.3,
      child: FittedBox(
        fit: BoxFit.contain,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            ..._buildStaticLetters(['c.svg', 'o.svg', 'r.svg']), // Letras C, O, R
            _buildAnimatedO(), // O animada
            const SizedBox(width: 10), // Padding entre letras
            _buildLetter('n.svg'),  // Letra N
            const SizedBox(width: 10), // Padding entre letras
            _buildLetter('a.svg'),  // Letra A
            Padding(
              padding: const EdgeInsets.only(bottom: 0),
              child: _buildLetter('registered.svg', height: 10), // Copyright
            ),
          ],
        ),
      ),
    );
  }

  // Método para construir las letras estáticas
  List<Widget> _buildStaticLetters(List<String> letters) {
    return letters
        .expand((letter) => [ 
          _buildLetter(letter), 
          const SizedBox(width: 10) // Espaciado entre letras
        ])
        .toList();
  }

  // Método para construir la animación de la letra "O"
  Widget _buildAnimatedO() {
    return ClipRect(
      child: SizedBox(
        height: widget.size * 0.15,
        width: widget.size * 0.15,
        child: AnimatedBuilder(
          animation: _animation,
          builder: (context, child) {
            return Transform.translate(
              offset: Offset(0, _animation.value), // Desplazar verticalmente
              child: Column(
                mainAxisAlignment: MainAxisAlignment.start,
                children: List.generate(3, (_) => _buildLetter('o.svg')),
              ),
            );
          },
        ),
      ),
    );
  }

  // Función para construir cada letra
  Widget _buildLetter(String assetName, {double? height}) {
    return SvgPicture.asset(
      'assets/svg/$assetName',
      height: height ?? widget.size * 0.15, // Ajustar la altura de la letra
      colorFilter: ColorFilter.mode(widget.color, BlendMode.srcIn), // Usar colorFilter para ajustar el color
    );
  }
}