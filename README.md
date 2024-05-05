# Sound Recommender

## Running the project

First you need to configure the environment.

You can create the `.env` by renaming the template `.env.example`.

The application uses MongoDB Atlas to preserve the data. I will provide the database URI via email.

Define `MONGODB_URI` in the `.env` file using the value from the email:

```
MONGODB_URI=<provided_uri>
```

Install the dependencies and run the dev server:

```shell
npm i
npm run dev
```

The server will start on port `8080`.

## Running Postman

I've updated the provided Postman collection to include tests for sound deletion.

Import the updated collection from the `sound_recommender.postman_collection.json`.

## What would I add provided more time

- DTOs. Currently controllers have quite a bit of duplicated code, by untroducing data transfer objects and converter functions for them I could reduce the amount of duplicated code and make the api of the app more clear.
- DAOs. Currently controllers communicate with the database directly, by introducing DAOs I could reduce this dependency. This would also likely reduce the amount of duplicated code and simplify the controllers logic.
- Unit tests. Currently the app is covered only by the tests defined in Postman. The app could benefit from smaller more focused tests defined for the models and controllers.

