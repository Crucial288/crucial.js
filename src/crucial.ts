//import { bindExpression } from "babel-types";

const _ = require('lodash')
const pug = require('pug')

const $ = document.querySelector.bind(document);

export default class Crucial {
    private container : Element = null;
    private nodes : Array<Element> = [];
    private components : Array<Component> = [];
    private app : Component;

    constructor(id: string, options: Object) {
        this.container = $(id);
        (window as any).app = this;

        this.CreateComponents()
    }

    public CreateComponents(parent: Element = null) : Array<Component> {
        console.log(this.nodes);

        /// Create array of all potential nodes in app
        let newNodes : Array<Element> = [];

        /// If parent wasn't set, query everything
        if (!parent) {
            parent = this.container;
        }

        newNodes = Array.from(parent.querySelectorAll('*'))
            .filter(n => n.nodeName.startsWith('C-'))

        //newNodes.push(this.container)

        /// Get all nodes that werent in previously stored nodes
        let differentNodes = newNodes.filter(n => !this.nodes.includes(n));
       
        /// Update stored nodes
        this.nodes = this.nodes.concat(differentNodes);

        //console.log(runtimeLess)
        //console.log(IComponent.Implementations())

        let newComponents : Array<Component> = [];

        for (let node of differentNodes) {

            let name = node.nodeName.substring(2);
            //name = name.charAt(0).toUpperCase() + name.substring(1).toLowerCase()
            name = _.startCase(name.toLowerCase()).replace(/ /g, '')

            let component : Component = null;

            for (let i of CruComponent.Implementations()) {
                if (i.name == name) {
                    component = new i(this, node);
                    newComponents.push(component);
                }
            }

            if (component == null) {
                console.warn(`Component with name: ${name} doesn't exist`)
                return
            }
        }

        /// Add all our new components to our total components array
        this.components = this.components.concat(newComponents)

        return newComponents;
    }

    // public Update(comp: Component) {
    //     this.CreateComponents(comp.container);
    // }
}

/// Used to register components so we can find them.
/// Need a new way to do this.
export namespace CruComponent {
    let implementations : any = [];

    export function Implementations(): Array<any> {
        return implementations;
    }

    export function New<T>(comp: T) {
        implementations.push(comp);
    }
}


export abstract class Component {
    public container : Element = null;
    public uid : string = '';
    private app : Crucial;
    private subComponents : Array<Component> = [];

    private binds : Array<{selector: string, event: string, action: Function}> = [];

    protected NewBind(bind: {selector: string, event: string, action: Function}) {
        this.binds.push(bind)
    }

    constructor(app : Crucial, container : Element) {
        this.app = app;

        //console.log(id);
        //this.container = $(id);
        this.container = container;

        this.uid = this.RandomID();
        //this.container.classList.add(this.uid);

        this.Created();
        this.Update();
    }

    protected abstract Template() : string;

    protected Created() { }

    protected Render() {
        console.log('render')

        let compiledPug = pug.render(this.Template().trim())
        console.log(compiledPug)

        this.container.innerHTML = compiledPug;

        /// Add class names to elements for scoped css
        for (let child of Array.from(this.container.querySelectorAll('*'))) {
            if (child.nodeName.startsWith('C-')) {
                continue;
            }
            
            child.classList.add(this.uid);
        }

        /// Iterate through style string and manually add .uid to every element for scoped css
        if (!!this.Style().trim()) {
            let style = this.ScopedStyle()
            this.container.innerHTML += `<style>${style}</style>`
        }

        /// Replace [] in Style() with our .uid for scoped css
        /// Works but not super elegant? Lets us use both scoped and global (or component + children scope)
        // if (!!this.Style()) {
        //     let scoped = this.Style().replace(/\[]/g, `.${this.uid}`)
        //     this.container.innerHTML += `<style>${scoped}</style>`
        // }


        /// Use less to wrap css with the .uid class - this makes embedded component also inherit styles
        // if (!!this.Style()) {
        //     let scoped = `.${this.uid} {${this.Style()}}`

        //     less.render(scoped, (err, out) => {
        //         this.container.innerHTML += `<style>${out.css}</style>`
        //     })
        // }

        let components = this.app.CreateComponents(this.container);
        this.subComponents = components;
    }

    private ScopedStyle() : string {
        let style = this.Style()
        let c = ''

        for (let i = 0; i < style.length; i++) {
            c = style[i]
            
            if (c == '{') {
                /// Found {, go back until finding element and add scope
                let count = 0
                for (let b = i - 1; b > 0; b--) {
                    if (style[b] == ' ') {
                        count++
                        continue;
                    }
        
                    let p1 = style.substring(0, b + 1)
                    let p2 = style.substring(b + 1)
        
                    style = p1 + `.${this.uid}` + p2
                    i += this.uid.length + count + 1
                    
                    break;
                } 
            }
        }

        return style;
    }

    private RandomID() : string {
        return 'c' + Math.random().toString(36).substr(2);
    }

    Update() { 
        this.Render();
        //this.Binds();
        this.Bind();
    }

    
    Bind() {
        console.log(this.binds)
        for (let bind of this.binds) {
            console.log("bind: " + bind.selector)
            this.container.querySelector(bind.selector).addEventListener(bind.event, () => bind.action);
        }
    }

    Binds() {

    }

    Style() : string {
        return '';
    }
}