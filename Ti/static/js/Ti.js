$(document).ready(() => {
    try {
        load();
    } catch (error) {
        console.log("Tela sem inicializador", error);
    }
});