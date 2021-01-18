<template>
  <div id="app">
    <el-container>
      <el-header>
        <el-row>
          <el-col :span="4">
            <router-link :to="{ name: 'home' }">
              <div class="logo">
                <img src="@/assets/images/routinator_logo_white.svg" />
              </div>
            </router-link>
          </el-col>
          <el-col :span="18"> &nbsp;</el-col>
          <el-col :span="2">
            <el-menu
              mode="horizontal"
              background-color="#000028"
              text-color="#fff"
              active-text-color="#fff"
              default-active=""
            >
              <el-menu-item @click="showHelp = true" class="help-menu">
                <i class="el-icon-help"></i>
              </el-menu-item>
            </el-menu>
          </el-col>
        </el-row>
      </el-header>

      <el-main>
        <router-view v-on:update-version="updateVersion" />
      </el-main>

      <el-footer height="40px">
        <el-row>
          <el-col :span="12">
            &copy; {{ new Date().getFullYear() }} Stichting NLnet Labs
            <span v-if="version">- Version {{ version }}</span>
          </el-col>
          <el-col :span="12" class="text-right">
            <a href="https://github.com/NLnetLabs/routinator-ui/issues/new" target="_blank">{{
              $t("common.report")
            }}</a>
          </el-col>
        </el-row>
      </el-footer>
    </el-container>
    <el-drawer title="Routinator Help" :visible.sync="showHelp" :with-header="false">
      <div class="help">
        <h4>Welcome to Routinator!</h4>
        <div>
          Help text here.
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showHelp: false,
      version: ""
    };
  },
  methods: {
    updateVersion(version) {
      this.version = version;
    }
  }
};
</script>

<style lang="scss">
html,
body {
  padding: 0;
  margin: 0;
  font-family: "Lato", sans-serif;
  background-color: #fff;
}

.el-container {
  min-height: 100vh;
}

.el-header {
  background: linear-gradient(45deg, #001f6d, #000028);
  color: #ffffff;
  z-index: 3;
}

.el-menu-item a {
  text-decoration: none;
}

.logo {
  line-height: 10px;
  img {
    width: 180px;
    margin-top: 12px;
  }
}

.logout {
  margin-left: 2rem;
  cursor: pointer;
}

.toolbar,
.text-right {
  text-align: right;
}

.help-menu {
  float: right !important;
  i {
    color: #ffffff !important;
  }
}

.el-footer {
  z-index: 100;
  background-color: #fafafa;
  color: #999;
  font-size: 13px;
  line-height: 40px;
  a,
  a:hover {
    color: #999;
    font-weight: bold;
    text-decoration: none;
  }
}

.valign-top {
  vertical-align: top !important;
}

.el-drawer__body {
  overflow-y: auto;
}

.help {
  line-height: 1.4rem;
  padding-left: 1rem;
  padding-right: 1rem;
  color: #666;
  code {
    background: #e4f7ae;
    padding: 0.2rem;
  }
}

a {
  color: #001f6d;
  &:hover {
    color: #000028;
  }
}
</style>
