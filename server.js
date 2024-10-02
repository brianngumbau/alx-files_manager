import express from 'express';
import routes from './routes/index';

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use('/', routes);

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});

export default app;
