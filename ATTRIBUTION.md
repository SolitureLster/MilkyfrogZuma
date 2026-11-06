# 来源与许可说明（ATTRIBUTION）

## 一、上游项目

| 项 | 内容 |
|---|---|
| 项目 | Tsuma —— A Zuma clone in TypeScript |
| 仓库 | <https://github.com/jamiely/tsuma> |
| 作者 | jamiely |
| 在线演示 | <https://jamiely.github.io/tsuma/>（上游完整版，非本仓库） |

本仓库（`zuma-demo/`）是上游代码的**课程作业改造版**，不是上游官方发布。

## 二、许可现状

- 上游快照中**没有 `LICENSE` / `COPYING` 文件**，README 也未声明许可证。
- 在未取得明确许可前，本项目**仅用于课程小组演示与学习交流**，不用于商业用途；代码公开仅供学习参考。
- 若需公开仓库或部署，请先向原作者确认许可证，或将仓库保持私有。
- 本仓库不对上游代码主张著作权；新增的文档与改造代码由课程小组编写。

## 三、保留与修改范围

### 3.1 原样保留（未改动）

- `src/boards/*`（关卡定义，演示版只用到 `board11`）
- `src/collision/*`、`src/movement/*`（碰撞与移动内核）
- `src/path.ts`、`src/util.ts`、`src/linkedList.ts`
- `src/sounds.ts`、`src/soundEffects.ts`、`src/events.ts`
- `src/vendor/*`（riffwave、sfxr）
- `public/*`（贴图与地图编辑背景）

### 3.2 修改

| 文件 | 修改性质 |
|---|---|
| `src/main.ts` | 锁定 `board11`、移除 URL 选关、联动结算遮罩 |
| `src/game.ts` | 新增终态守卫、导出 `restartGame`、计分累加；删除自动跳关/自动重开 |
| `src/match.ts` | 回传本次消除的球数（`cleared`） |
| `src/types.ts` | `Game.score` 字段 |
| `src/renderer.ts` | 移除旧结束文案，删除未使用的 `drawImage` |
| `src/gameExport.ts` | `score` 的向后兼容默认值 |
| `index.html`、`src/style.css` | 结算遮罩 DOM 与样式 |
| `src/game.test.ts`、`src/collision/collision.test.ts`、`src/movement/movement.test.ts` | 同步测试夹具与用例 |

### 3.3 新增

- `docs/01-调用链定位报告.md`
- `docs/提交说明.md`
- `ATTRIBUTION.md`
- 重写的 `README.md`、重述的 `TODO.md`

## 四、第三方资源

| 资源 | 用途 | 说明 |
|---|---|---|
| `github-fork-ribbon-css` | 页面右上角角标 | 随上游引入，许可证以该仓库为准 |
| `jsfxr` | 程序化生成音效 | 随上游引入，许可证以该仓库为准 |
| `public/image/milkyfrog.jpg` | 青蛙炮台贴图 | 随上游引入，来源见上游仓库 |

如课程要求对外发布，请一并核对上述资源的许可证与署名要求。
