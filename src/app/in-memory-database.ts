import { InMemoryDbService, httpClientInMemBackendServiceFactory } from "angular-in-memory-web-api";
import { Category } from "./pages/categories/shared/category.model";


export class InMemoryDatabase implements InMemoryDbService{
    createDb(){
        const categories = [
            { id: 1, name: "Moradia", description: "Pagamentos de contas da casa" },
            { id: 2, name: "Saúde", description: "Planos de saúde e remédio" },
            { id: 3, name: "Lazer", description: "Cinemas, praias, parques, etc" },
            { id: 4, name: "Salário", description: "Recebimentos de Salários" },
            { id: 5, name: "Freelas", description: "Trabalhos como Freelancer" }
        ];

        return {categories}
    }
}
