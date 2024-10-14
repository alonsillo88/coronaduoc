import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class AnimatedCoronaLogo extends StatefulWidget {
  final double size;  // Tamaño ajustable
  final Color color;  // Color ajustable

  const AnimatedCoronaLogo({
    super.key,  // Usando super.parameters
    this.size = 300, // Tamaño por defecto
    this.color = Colors.black, // Color por defecto
  });

  @override
  AnimatedCoronaLogoState createState() => AnimatedCoronaLogoState();
}

class AnimatedCoronaLogoState extends State<AnimatedCoronaLogo> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();

    // Configurar la animación de la "O" giratoria
    _controller = AnimationController(
      duration: const Duration(seconds: 1),  // Duración de la animación completa
      vsync: this,
    )..repeat();  // Repetir la animación de forma continua

    // Usar una animación lineal de desplazamiento vertical (y)
    _animation = Tween<double>(begin: -45, end: -90).animate(_controller);
  }

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
            _buildLetter('c.svg'), // Letra C
            const SizedBox(width: 10), // Padding entre las letras
            _buildLetter('o.svg'), // Primera O estática
            const SizedBox(width: 10), // Padding entre las letras
            _buildLetter('r.svg'), // Letra R
            const SizedBox(width: 10), // Padding entre las letras

            // ClipRect para contener la animación de las "O"
            ClipRect(
              child: SizedBox(
                height: widget.size * 0.15,  // Ajustar el tamaño según la propiedad size
                width: widget.size * 0.15,
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    AnimatedBuilder(
                      animation: _animation,
                      builder: (context, child) {
                        return Transform.translate(
                          offset: Offset(0, _animation.value),  // Desplazar verticalmente
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.start,
                            children: [
                              _buildLetter('o.svg'),  // O superior
                              _buildLetter('o.svg'),  // O media
                              _buildLetter('o.svg'),  // O inferior
                            ],
                          ),
                        );
                      },
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(width: 10), // Padding entre las letras
            _buildLetter('n.svg'),  // Letra N
            const SizedBox(width: 10), // Padding entre las letras
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

  // Función para construir cada letra, ajustando el color
  Widget _buildLetter(String assetName, {double? height}) {
    return SvgPicture.asset(
      'assets/svg/$assetName',
      height: height ?? widget.size * 0.15,  // Ajustar la altura de la letra
      colorFilter: ColorFilter.mode(widget.color, BlendMode.srcIn),  // Usar colorFilter en vez de color
    );
  }
}
