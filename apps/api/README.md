## Development
To start the development server run:
```bash
bun run dev
```

To start the development database:
```bash
docker run -d -p 5432:5432 --name illustrious -e POSTGRES_PASSWORD=illustrious postgres
```

Open http://localhost:3000/ with your browser to see the result.
