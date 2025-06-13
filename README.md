-npx create-next-app@latest zealthy --typescript --tailwind --app --src-dir --import-alias "@/*"
-npm i express cors nodemon
-npm i pg
-mkdir src/app/{admin, data}
-mkdir -p server/{routes,config,database}

npm i lucide-react
npm install bcrypt bcryptjs

## Set up PostgreSQL Image in Docker -
1. Run Docker application on PC/Laptop
2. 
docker run --name zealthy_pg \
  -e POSTGRES_USER=harsh \
  -e POSTGRES_PASSWORD=alva \
  -e POSTGRES_DB=zealthy_db \
  -p 5432:5432 \
  -d postgres

3. docker ps
This confirms that the PostgreSQL Image is Running.

4. docker exec -it zealthy_pg psql -U harsh -d zealthy_db

zealthy_db=# \l
-> This will list out the zealthy_db

zealthy_db=# \c zealthy_db
-> You are now connected to database "zealthy_db" as user "harsh".

zealthy_db=# \q
-> Quit

Change .env files for getting different URL's and user info!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# zealthy
