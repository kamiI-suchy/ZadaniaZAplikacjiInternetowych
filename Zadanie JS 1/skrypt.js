class Presenter {

    constructor(container){
        this.container = container;
    }

    showLayout(type){

        this.container.innerHTML = "";

        if(type === "A") this.layoutX();
        if(type === "B") this.layoutY();
        if(type === "C") this.layoutZ();
    }

    createBox(text,row,col){
        const div = document.createElement("div");
        div.className = "box";
        div.textContent = text;
        div.style.gridRow = row;
        div.style.gridColumn = col;
        return div;
    }

    layoutX(){

        const grid = document.createElement("div");
        grid.className = "grid3";

        grid.appendChild(this.createBox("Kamil",1,1));
        grid.appendChild(this.createBox("Suchy",2,2));
        grid.appendChild(this.createBox("1",3,3));

        this.container.appendChild(grid);
    }

    layoutY(){

        const grid = document.createElement("div");
        grid.className = "grid3";

        grid.appendChild(this.createBox("Kamil",2,1));
        grid.appendChild(this.createBox("Suchy",2,2));
        grid.appendChild(this.createBox("1",2,3));

        this.container.appendChild(grid);
    }

    layoutZ(){

        const grid = document.createElement("div");
        grid.className = "grid4";

        grid.appendChild(this.createBox("Kamil",1,1));
        grid.appendChild(this.createBox("Suchy",1,2));
        grid.appendChild(this.createBox("1",4,3));
        grid.appendChild(this.createBox("2",4,4));

        this.container.appendChild(grid);
    }

}

class Controller{

    constructor(buttons, container){
        this.presenter = new Presenter(container);
        this.init(buttons);
    }

    init(buttons){

        buttons.forEach(button=>{
            button.addEventListener("click",(e)=>{
                this.buttonClicked(e.target.dataset.layout);
            });
        });

    }

    buttonClicked(layout){
        this.presenter.showLayout(layout);
    }

}

new Controller(
    document.querySelectorAll("#pair1 button"),
    document.getElementById("layout1")
);

new Controller(
    document.querySelectorAll("#pair2 button"),
    document.getElementById("layout2")
);