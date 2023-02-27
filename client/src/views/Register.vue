<script setup lang="ts">
import Input from "@/components/Input.vue";
</script>

<template>
  <div :class="styles.header">
    <span>Sign Up</span>
  </div>
  <div :class="styles.container">
    <div>
      <div :class="styles.field">
        <label>Name</label>
        <!-- /^[A-Za-z ]+$/ -->
        <Input />
      </div>
      <!-- <span v-if="formErrors?.name" :class="styles.error_msg">{{
        formErrors.name
      }}</span> -->
    </div>
    <div>
      <div :class="styles.field">
        <label>Email Id</label>
        <!-- /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/ -->
        <Input />
      </div>
      <!-- <span v-if="formErrors?.email" :class="styles.error_msg">{{
        formErrors.email
      }}</span> -->
    </div>
    <div>
      <div :class="styles.field">
        <label>Password</label>
        <!-- /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/ -->
        <Input />
      </div>
      <!-- <span v-if="formErrors?.password" :class="styles.error_msg">{{
        formErrors.password
      }}</span> -->
    </div>
    <div>
      <div :class="styles.field">
        <label>Confirm Password</label>
        <Input />
      </div>
      <!-- <span v-if="formErrors?.confirmPassword" :class="styles.error_msg">{{
        formErrors.confirmPassword
      }}</span> -->
    </div>
    <div :class="styles.cta">
      <button @click="">Register</button>
    </div>
  </div>
</template>

<style lang="scss" module="styles">
.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  span {
    font-size: 24px;
    font-family: "Poppins-Medium", sans-serif;
  }
}

.container {
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin-top: 30px;
  .field {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .error_msg {
    display: block;
    margin-top: 5px;
    color: #da3025;
    font-size: 14px;
  }
}
.cta {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  button {
    background-color: gray;
    border: none;
    color: white;
    padding: 7px 0px;
    width: 100%;
    border-radius: 4px;
  }
}
</style>
