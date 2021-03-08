<template>
  <v-container>
    <v-row justify="space-between">
      <v-col cols="auto" md="6">
        <v-form v-model="valid">
          <v-text-field
            v-model="model.numero"
            counter="10"
            :rules="[required('Nº Pedido'), maxLength('Nº Pedido', 10)]"
            label="Nº Pedido"
          ></v-text-field>
          <v-text-field
            v-model="model.cliente"
            counter="255"
            :rules="[required('Cliente'), maxLength('Cliente', 255)]"
            label="Cliente"
          ></v-text-field>
          <v-row justify="center">
            <v-date-picker v-model="model.data" locale="pt-BR"></v-date-picker>
          </v-row>
          <v-btn color="success" class="mt-4" @click="addItem"
            >Adicionar Item</v-btn
          >
          <v-simple-table fixed-header height="300px">
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">
                    Descrição
                  </th>
                  <th class="text-left">
                    Quantidade
                  </th>
                  <th class="text-left">
                    Valor Unitário
                  </th>
                  <th class="text-left">
                    Valor Total
                  </th>
                  <th class="text-left">
                    #
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in model.itens" :key="item.index">
                  <td>
                    <v-text-field
                      v-model="item.descricao"
                      counter="50"
                      :rules="[
                        required('Descrição'),
                        maxLength('Nº Pedido', 50)
                      ]"
                    ></v-text-field>
                  </td>
                  <td>
                    <v-text-field
                      v-model="item.quantidade"
                      type="number"
                      :rules="[required('Quantidade')]"
                    ></v-text-field>
                  </td>
                  <td>
                    <v-text-field
                      v-model="item.valor_unitario"
                      type="number"
                      :rules="[required('Valor Unitário')]"
                    ></v-text-field>
                  </td>
                  <td>
                    <v-text-field
                      v-model="item.valor_total"
                      type="number"
                      :rules="[required('Valor Total')]"
                    ></v-text-field>
                  </td>
                  <td>
                    <v-btn icon color="red" @click="removeItem(item)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
          <v-text-field
            v-model="model.valor_total"
            :rules="[required('Valor Total')]"
            prefix="R$"
            label="Valor Total"
          ></v-text-field>
          <v-btn
            color="success"
            :disabled="!valid"
            class="mr-4"
            @click="addPedido"
            >Gravar</v-btn
          >
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import gql from "graphql-tag";

const ADD_PEDIDO = gql`
  mutation add_pedido(
    $cliente: String!
    $data: date!
    $numero: String!
    $valor_total: numeric!
    $item_pedidos: [item_pedido_insert_input!]!
  ) {
    insert_pedido(
      objects: {
        cliente: $cliente
        data: $data
        numero: $numero
        valor_total: $valor_total
        reservar: false
        item_pedidos: { data: $item_pedidos }
      }
    ) {
      returning {
        cliente
        data
        id
        numero
        reservar
        valor_total
        item_pedidos {
          descricao
          id
          id_pedido
          quantidade
          valor_total
          valor_unitario
        }
      }
    }
  }
`;

export default {
  name: "Crud",
  data: () => ({
    valid: false,
    required(propertyType) {
      return v =>
        (v && v.length > 0) || ` O Campo ${propertyType} é obrigatório!`;
    },
    maxLength(propertyType, maxLength) {
      return v =>
        (v && v.length <= maxLength) ||
        `O campo ${propertyType} não pode ser maior que  ${maxLength} caracteres`;
    },
    model: {
      id: "",
      cliente: "",
      numero: "",
      data: new Date().toISOString().substring(0, 10),
      valor_total: "",
      itens: [
        {
          descricao: "",
          quantidade: Number(0),
          valor_unitario: Number(0),
          valor_total: Number(0)
        }
      ]
    }
  }),
  methods: {
    validateField() {
      this.$refs.form.validate();
    },
    addItem() {
      this.model.itens.push({
        descricao: "",
        quantidade: Number(0),
        valor_unitario: Number(0),
        valor_total: Number(0)
      });
    },
    removeItem(item) {
      this.model.itens.splice(this.model.itens.indexOf(item), 1);
    },
    addPedido() {
      this.$apollo.mutate({
        mutation: ADD_PEDIDO,
        variables: {
          cliente: this.model.cliente,
          numero: this.model.numero,
          data: this.model.data,
          valor_total: this.model.valor_total,
          item_pedidos: this.model.itens
        }
      });
    }
  }
};
</script>
