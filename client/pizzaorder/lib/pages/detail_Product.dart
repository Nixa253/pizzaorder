import 'package:flutter/material.dart';

class PizzaDetails extends StatefulWidget {
  const PizzaDetails({super.key});

  @override
  State<PizzaDetails> createState() => _PizzaDetailsState();
}
class _PizzaDetailsState extends State<PizzaDetails> {
  int _quantity = 1;
  String? _selectedSupplement1;
  String? _selectedSupplement2;
  double _totalPrice = 30.00;
  bool _isFavorite = false; // Biến trạng thái để theo dõi trạng thái trái tim

  final Map<String, double> extrasPrices = {
    'Hot sauce': 1.00,
    'Fried Egg': 1.62,
    'Mushrooms': 2.00,
    'Caramelized Onions': 2.75,
  };

  final Map<String, bool> selectedExtras = {
    'Hot sauce': false,
    'Fried Egg': false,
    'Mushrooms': false,
    'Caramelized Onions': false,
  };

  void _updateTotalPrice() {
    double newTotal = 30.00 * _quantity;
    selectedExtras.forEach((key, value) {
      if (value) newTotal += extrasPrices[key]!;
    });
    setState(() {
      _totalPrice = newTotal;
    });
  }

  void _incrementQuantity() {
    setState(() {
      _quantity++;
      _updateTotalPrice();
    });
  }

  void _decrementQuantity() {
    if (_quantity > 1) {
      setState(() {
        _quantity--;
        _updateTotalPrice();
      });
    }
  }

  void _toggleFavorite() {
    setState(() {
      _isFavorite = !_isFavorite;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFEEF8EB),
      body: Stack(
        children: [
          CustomScrollView(
            slivers: [
              _buildSliverAppBar(context),
              _buildSliverPersistentHeader(),
              _buildSliverToBoxAdapter(),
            ],
          ),
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: _buildTotalPriceRow(),
          ),
        ],
      ),
    );
  }

  SliverAppBar _buildSliverAppBar(BuildContext context) {
    return SliverAppBar(
      expandedHeight: 400.0,
      floating: false,
      pinned: true,
      leading: _buildCircleIconButton(
        icon: Icons.arrow_back,
        onPressed: () {
          Navigator.pop(context);
        },
      ),
      actions: [
        _buildCircleIconButton(
          icon: _isFavorite ? Icons.favorite : Icons.favorite_border,
          iconColor: _isFavorite ? Colors.red : Colors.orange,
          onPressed: _toggleFavorite,
        ),
      ],
      flexibleSpace: FlexibleSpaceBar(
        background: ClipPath(
          clipper: MyClipper(),
          child: Container(
            decoration: const BoxDecoration(
              color: Color.fromARGB(255, 233, 100, 100),
            ),
            child: Center(
              child: SizedBox(
                height: 350,
                width: 350,
                child: Stack(
                  children: [
                    Image.asset('assets/images/woodplate.png'),
                    Center(
                      child: Image.asset('assets/images/pizza3.png'),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildCircleIconButton({
    required IconData icon,
    required VoidCallback onPressed,
    Color iconColor = Colors.orange,
  }) {
    return Container(
      margin: const EdgeInsets.all(8.0),
      decoration: const BoxDecoration(
        shape: BoxShape.circle,
        color: Colors.white,
      ),
      child: IconButton(
        icon: Icon(icon, color: iconColor),
        onPressed: onPressed,
      ),
    );
  }

  SliverPersistentHeader _buildSliverPersistentHeader() {
    return SliverPersistentHeader(
      delegate: _SliverAppBarDelegate(
        minHeight: 60.0,
        maxHeight: 60.0,
        child: Container(
          color: const Color(0xFFEEF8EB),
          child: _buildTitleRow(),
        ),
      ),
      pinned: true,
    );
  }

  SliverToBoxAdapter _buildSliverToBoxAdapter() {
    return SliverToBoxAdapter(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Tomato sauce, Mozzarella cheese, Ham, Pineapple chunks',
              style: TextStyle(color: Color.fromARGB(255, 255, 0, 0)),
            ),
            const SizedBox(height: 16),
            const Text(
              'Ingredients',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildIngredientItem(
                    'Mozzarella', 'assets/icons/cheese_pic.png'),
                _buildIngredientItem('Tomato', 'assets/icons/tomato_pic.png'),
                _buildIngredientItem('Onion', 'assets/icons/onion.png'),
              ],
            ),
            const SizedBox(height: 16),
            const Text(
              'Supplements',
              style: TextStyle(
                  fontSize: 18, fontWeight: FontWeight.bold, color: Colors.red),
            ),
            const Text(
              'Choose 1',
              style: TextStyle(color: Colors.grey),
            ),
            const SizedBox(height: 8),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildSupplementItem(
                    'Fries', 'assets/icons/fried.png', _selectedSupplement1),
                _buildSupplementItem('Potatoes', 'assets/icons/potaetos.png',
                    _selectedSupplement1),
                _buildSupplementItem('Chicken Nuggets',
                    'assets/icons/pngegg.png', _selectedSupplement1),
              ],
            ),
            const SizedBox(height: 16),
            const Text(
              'Supplements',
              style: TextStyle(
                  fontSize: 18, fontWeight: FontWeight.bold, color: Colors.red),
            ),
            const Text(
              'Choose 1',
              style: TextStyle(color: Colors.grey),
            ),
            const SizedBox(height: 8),
            Column(
              children: [
                _buildSupplementRadio('Coca-Cola', 'assets/images/coca.png',
                    _selectedSupplement2),
                _buildSupplementRadio(
                    'Pepsi', 'assets/images/coca.png', _selectedSupplement2),
                _buildSupplementRadio(
                    'Sprite', 'assets/images/sprite.png', _selectedSupplement2),
                _buildSupplementRadio(
                    'Fanta', 'assets/images/fanta.png', _selectedSupplement2),
              ],
            ),
            const SizedBox(height: 16),
            _buildExtrasSection(),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }

 Widget _buildTitleRow() {
  return Row(
    mainAxisAlignment: MainAxisAlignment.spaceBetween,
    children: [
      const Padding(
        padding: EdgeInsets.all(16.0),
        child: Text(
          'Capricciosa',
          style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
        ),
      ),
      Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(8.0),
          border: Border.all(color: Colors.grey.shade300),
        ),
        child: Row(
          children: [
            _buildQuantityButton(
              icon: Icons.remove,
              onPressed: _decrementQuantity,
              buttonColor: Colors.white,
              iconColor: Colors.red,
              borderColor: Colors.red,
            ),
            Container(
              decoration: const BoxDecoration(
                color: Colors.red,
                // borderRadius: BorderRadius.circular(8.0),
              ),
              padding: const EdgeInsets.symmetric(horizontal: 14.0, vertical: 6.0),
              child: Text(
                '$_quantity',
                style: const TextStyle(color: Colors.white, fontSize: 20),
              ),
            ),
            _buildQuantityButton(
              icon: Icons.add,
              onPressed: _incrementQuantity,
              buttonColor: Colors.white,
              iconColor: Colors.green,
              borderColor: Colors.green,
            ),
          ],
        ),
      ),
    ],
  );
}

Widget _buildQuantityButton({
  required IconData icon,
  required VoidCallback onPressed,
  required Color buttonColor,
  required Color iconColor,
  required Color borderColor,
}) {
  return Container(
    decoration: BoxDecoration(
      shape: BoxShape.rectangle,
      border: Border.all(color: borderColor, width: 1), // Thinner border
      color: buttonColor,
      borderRadius: BorderRadius.circular(8.0),
    ),
    child: IconButton(
      icon: Icon(icon, color: iconColor),
      onPressed: onPressed,
      padding: EdgeInsets.zero, // Removes extra padding
      constraints: const BoxConstraints(),
    ),
  );
}

  Widget _buildIngredientItem(String ingredient, String imagePath) {
    return Column(
      children: [
        Container(
          width: 80,
          height: 80,
          decoration: BoxDecoration(
            color: Colors.grey[300],
            borderRadius: BorderRadius.circular(10),
            image: DecorationImage(
              image: AssetImage(imagePath),
              fit: BoxFit.cover,
            ),
          ),
        ),
        const SizedBox(height: 8),
        Text(ingredient),
      ],
    );
  }

  Widget _buildSupplementItem(
      String supplement, String imagePath, String? selectedValue) {
    return GestureDetector(
      onTap: () {
        setState(() {
          _selectedSupplement1 = supplement;
        });
      },
      child: Container(
        width: 100,
        height: 120,
        decoration: BoxDecoration(
          color: Colors.grey[300],
          borderRadius: BorderRadius.circular(10),
          border: Border.all(
            color: _selectedSupplement1 == supplement
                ? Colors.red
                : Colors.transparent,
            width: 2,
          ),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 60,
              height: 60,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(10),
                image: DecorationImage(
                  image: AssetImage(imagePath),
                  fit: BoxFit.cover,
                ),
              ),
            ),
            const SizedBox(height: 8),
            Text(
              supplement,
              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSupplementRadio(
      String value, String imagePath, String? groupValue) {
    return RadioListTile<String>(
      secondary: SizedBox(
        width: 40,
        height: 40,
        child: Image.asset(
          imagePath,
          fit: BoxFit.cover,
        ),
      ),
      title: Text(
        value,
        style: const TextStyle(color: Colors.red),
      ),
      value: value,
      groupValue: groupValue,
      onChanged: (value) {
        setState(() {
          _selectedSupplement2 = value;
        });
      },
      activeColor: Colors.red,
      controlAffinity: ListTileControlAffinity.trailing,
    );
  }

 Widget _buildExtrasSection() {
  return Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      const Text(
        'Extras',
        style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
      ),
      for (var extra in selectedExtras.keys)
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              extra,
              style: const TextStyle(fontSize: 16),
            ),
            Row(
              children: [
                Text(
                  '\$${extrasPrices[extra]!.toStringAsFixed(2)}',
                  style: const TextStyle(fontSize: 16, color: Colors.red),
                ),
                Theme(
                  data: Theme.of(context).copyWith(
                    unselectedWidgetColor: Colors.red, // màu checkbox khi không được chọn
                  ),
                  child: Checkbox(
                    value: selectedExtras[extra],
                    onChanged: (bool? value) {
                      setState(() {
                        selectedExtras[extra] = value ?? false;
                        _updateTotalPrice();
                      });
                    },
                    activeColor: Colors.red, // màu checkbox khi được chọn
                  ),
                ),
              ],
            ),
          ],
        ),
    ],
  );
}

  Widget _buildTotalPriceRow() {
    return Container(
      padding: const EdgeInsets.all(16.0),
      decoration: BoxDecoration(
        color: const Color(0xFFEEF8EB),
        borderRadius: BorderRadius.circular(8.0),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.3),
            spreadRadius: 2,
            blurRadius: 5,
            offset: const Offset(0, 3), // changes position of shadow
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            '${_totalPrice.toStringAsFixed(3)} đ',
            style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: Color.fromARGB(255, 0, 0, 0)),
          ),
          ElevatedButton.icon(
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Thêm vào giỏ hàng thành công'),
                ),
              );
            },
            icon: const Icon(Icons.shopping_basket,
                color: Color.fromARGB(255, 255, 255, 255)),
            label: const Text('Thêm vào giỏ',
                style: TextStyle(color: Color.fromARGB(255, 255, 255, 255))),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
              padding:
                  const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8.0),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class MyClipper extends CustomClipper<Path> {
  @override
  Path getClip(Size size) {
    Path path = Path();
    path.lineTo(0, size.height - 100);
    path.quadraticBezierTo(
        size.width / 2, size.height, size.width, size.height - 100);
    path.lineTo(size.width, 0);
    path.close();
    return path;
  }

  @override
  bool shouldReclip(covariant CustomClipper<Path> oldClipper) {
    return false;
  }
}

class _SliverAppBarDelegate extends SliverPersistentHeaderDelegate {
  _SliverAppBarDelegate({
    required this.minHeight,
    required this.maxHeight,
    required this.child,
  });
  final double minHeight;
  final double maxHeight;
  final Widget child;

  @override
  double get minExtent => minHeight;

  @override
  double get maxExtent => maxHeight;

  @override
  Widget build(
      BuildContext context, double shrinkOffset, bool overlapsContent) {
    return SizedBox.expand(child: child);
  }

  @override
  bool shouldRebuild(_SliverAppBarDelegate oldDelegate) {
    return maxHeight != oldDelegate.maxHeight ||
        minHeight != oldDelegate.minHeight ||
        child != oldDelegate.child;
  }
}