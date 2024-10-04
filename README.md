![Crud App](https://github.com/user-attachments/assets/e6a4f189-7d7c-40af-bf20-30d2b04928f1)

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="styile.css">
    <title>Crud regsitro de usuarios</title>
</head>

<body>
    <main class="container">
        <section class="Crud">
            <h1 class="Crud__title">Crud regsitro de usuarios</h1>
            <form id="formRegister" class="Crud_form">
                <input type="text" name="name" id="name" placeholder="Nombre" class="form__input">
                <input type="email" name="email" id="email" placeholder="Correo" class="form__input">
                <button type="submit" id="submitButton" class="button--primary"> Add</button>
            </form>
            <table>
                <thead>
                    <tr>
                        <th class="table_Hedader">Nombre</th>
                        <th class="table_Hedader">Correo</th>
                        <th class="table_Hedader">Acciones</th>
                    </tr>
                </thead>
                <tbody id="tableBody" class="table__body">

                </tbody>
            </table>
        </section>

    </main>


    <script src="app.js"></script>
</body>

</html>
