<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-loading-bar-provider>
      <n-message-provider>
        <n-notification-provider>
          <n-dialog-provider>
            <n-layout>
              <n-layout-content>
                <router-view></router-view>
              </n-layout-content>
              <n-layout-footer><FooterPaneel /></n-layout-footer>
            </n-layout>
          </n-dialog-provider>
        </n-notification-provider>
      </n-message-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<script>
import { defineComponent } from "vue";
import { NConfigProvider } from "naive-ui";
import FooterPaneel from "./components/FooterPaneel.vue";

const themeOverrides = {
  common: {
    fontSizeSmall: "11px",
    fontSizeMedium: "11px",
    fontSizeLarge: "11px",
    fontSizeHuge: "11px",
    titleFontSize: "8px",
  },
};

export default defineComponent({
  components: {
    FooterPaneel,
  },
  data() {
    return {
      themeOverrides: themeOverrides,
    };
  },
});
</script>
