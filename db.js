const Sequelize = require('sequelize');

const conn = new Sequelize(process.env.DATABASE_URL);

const Product = conn.define('product', {
  name: conn.Sequelize.STRING
});

const User = conn.define('user', {
  name: conn.Sequelize.STRING,
  password: conn.Sequelize.STRING
});

User.belongsTo(Product, { as: 'bestProduct' });
User.belongsTo(Product, { as: 'worstProduct' });

const sync = ()=> conn.sync({ force: true });

const seed = ()=> {
  const products = ['foo', 'bar', 'bazz'];
  const users = [ 'moe', 'larry', 'curly'];
  let foo, bar, bazz, moe, larry, curly;

  return sync()
    .then(()=> {
      const productPromises = products.map(name => Product.create({ name }));
      const userPromises = users.map((name, idx)=> User.create({ name, password: products[idx]}));
      return Promise.all(productPromises.concat(userPromises))
              .then(results => [foo, bar, bazz, moe, larry, curly] = results)
              .then( ()=> Promise.all([
                moe.setBestProduct(foo),
                moe.setWorstProduct(bar),
                curly.setBestProduct(bazz)
              ]))
    });
};

module.exports = {
  models: {
    Product,
    User
  },
  sync,
  seed
};
