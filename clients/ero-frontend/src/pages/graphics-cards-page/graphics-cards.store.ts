import { defineStore, GettersTree } from "pinia";
import { HttpClient } from "../../http-client";
import { Direction } from "../../interfaces/direction.enum";
import { FilterBy } from "../../interfaces/filter-by.enum";
import { Product } from "../../interfaces/product.interface";

export interface GraphicsCardsState {
  cards: Product[];
  showOnlyInStock: boolean;
  retailers: string[];
  filterDirection: Direction;
  filterBy: FilterBy;
  selectedRetailer: string | undefined;
}

export interface GraphicsCardsActions {
  getGraphicsCards: () => Promise<void>;
  getRetailers: () => Promise<void>;
}

export interface GraphicsCardsGetters extends GettersTree<GraphicsCardsState> {
  filteredGraphicsCards: (state: GraphicsCardsState) => Product[];
}

export const useGraphicsCardsStore = defineStore<
  string,
  GraphicsCardsState,
  GraphicsCardsGetters,
  GraphicsCardsActions
>("GRAPHICS_CARDS_STORE", {
  state: () => ({
    cards: [],
    showOnlyInStock: false,
    retailers: [],
    selectedRetailer: undefined,
    filterBy: FilterBy.Title,
    filterDirection: Direction.Ascending,
  }),
  getters: {
    filteredGraphicsCards(state): Product[] {
      let cards: Product[] = state.cards;

      if (state.showOnlyInStock) {
        cards = cards.filter((card) => card.inStock);
      }

      if (state.selectedRetailer) {
        cards = cards.filter(
          (card) => card.retailer.name === state.selectedRetailer
        );
      }

      return cards;
    },
  },
  actions: {
    async getGraphicsCards() {
      const { data } = await HttpClient.get("/products");
      this.cards = data;
    },
    async getRetailers() {
      const { data } = await HttpClient.get("/retailers");
      this.retailers = data;
    },
  },
});
