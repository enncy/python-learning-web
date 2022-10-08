<template>
  <div>
    <div class="statistic-items" v-if="statistic">
      <div class="statistic-item">
        <a-statistic title="用户总数" :value="statistic.totalUserCount" />
      </div>
      <div class="statistic-item">
        <a-statistic title="教程总数" :value="statistic.totalArticleCount" />
      </div>
      <div class="statistic-item">
        <a-statistic title="帖子总数" :value="statistic.totalPostCount" />
      </div>
      <div class="statistic-item">
        <a-statistic title="评论总数" :value="statistic.totalCommentCount" />
      </div>
    </div>
    <div class="statistic-todays">
      <Card class="mt-5" title="今日系统统计">
        <canvas height="200" width="400" ref="systemChartContainer"> </canvas>
      </Card>
      <Card class="mt-5">
        <template #title>
          <div class="d-flex align-items-center">
            <h3 class="mb-1 col-6">今日分区统计</h3>
            <div class="mb-1 col-6 d-flex justify-content-end">
              <a-select
                v-if="todayCategoryStatistics?.length"
                style="width: 100px"
                size="small"
                v-model:value="currentCategoryStatisticName"
                :options="
                  todayCategoryStatistics?.map((s) => ({
                    label: s.name,
                    value: s.name,
                  }))
                "
              ></a-select>
            </div>
          </div>
        </template>

        <div v-show="currentCategoryStatistics?.statistics.length">
          <canvas height="200" width="400" ref="categoryChartContainer">
          </canvas>
        </div>

        <div
          v-if="
            currentCategoryStatistics === undefined ||
            currentCategoryStatistics.statistics.length === 0
          "
        >
          <a-empty></a-empty>
        </div>
      </Card>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, nextTick, onBeforeMount, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { AdminApi } from "../../api";
import { Statistic, StatisticCategory } from "../../store/interface";
import { Chart, ChartConfiguration, registerables } from "chart.js";
import Card from "../../components/common/Card.vue";
import dayjs from "dayjs";
import { getBackgroundColors } from "../../utils/chart";

import ChartDataLabels from "chartjs-plugin-datalabels";

interface CategoryStatistic {
  name: string;
  statistics: StatisticCategory[];
}

Chart.register(...registerables);
Chart.register(ChartDataLabels);

const route = useRoute();
const systemChartContainer = ref();
const categoryChartContainer = ref();
const statistic = ref<Statistic>();
const currentCategoryStatisticName = ref<string>("");
const currentCategoryStatistics = computed(() =>
  categoryStatistics.value.find(
    (s) => s.name === currentCategoryStatisticName.value
  )
);
const categoryStatistics = ref<CategoryStatistic[]>([]);
const todayCategoryStatistics = ref<CategoryStatistic[]>([]);

function getChartConfig(chartData: any[]): Partial<ChartConfiguration> {
  return {
    options: {
      plugins: {
        legend: {
          display: false,
        },
        datalabels: {
          anchor: "end",
        },
      },
      scales: {
        yAxis: {
          display: true,
          max: Math.max(...chartData) + 2,
        },
      },
    },
    plugins: [ChartDataLabels],
  };
}

function sameDate(date: number) {
  const d = new Date(date);
  return (
    d.getDate() === new Date().getDate() &&
    d.getMonth() === new Date().getMonth() &&
    d.getFullYear() === new Date().getFullYear()
  );
}

onMounted(() => {
  nextTick(() => {
    AdminApi.statistic().then(({ data: { data } }) => {
      statistic.value = data;
      const todaySystem = statistic.value.statisticSystems.find((s) =>
        sameDate(s.recordDate)
      );
      if (todaySystem) {
        const chartData = [
          todaySystem.registerCount,
          todaySystem.loginCount,
          todaySystem.postViewCount,
          todaySystem.newPostCount,
          todaySystem.newCommentCount,
          todaySystem.articleViewCount,
        ];
        const systemChart = new Chart(systemChartContainer.value, {
          type: "bar",
          data: {
            labels: [
              "注册数",
              "登录数",
              "帖子浏览",
              "新帖",
              "新评论",
              "文章浏览",
            ],
            datasets: [
              {
                backgroundColor: getBackgroundColors(6),
                data: chartData,
              },
            ],
          },
          ...getChartConfig(chartData),
        });
      }

      // 根据版块的分区名去生成列表，根据选择的分区显示今天的统计数据

      const createData = (
        cs: CategoryStatistic
      ): ChartConfiguration | undefined => {
        const sta = cs.statistics.at(0);

        if (sta) {
          const data = [
            sta.viewCount,
            sta.postViewCount,
            sta.newPostCount,
            sta.newCommentCount,
            sta.subscribeCount,
          ];
          return {
            type: "bar",
            data: {
              labels: ["浏览数", "帖子浏览", "新帖", "新评论", "订阅数"],
              datasets: [
                {
                  backgroundColor: getBackgroundColors(5),
                  data: data,
                },
              ],
            },
            ...getChartConfig(data),
          };
        }
      };

      let categoryChart: Chart;
      // 监听选择，动态生成图表
      watch(currentCategoryStatistics, () => {
        if (currentCategoryStatistics.value?.statistics.length) {
          const chartData = createData(currentCategoryStatistics.value);
          if (chartData) {
            categoryChart?.destroy();
            categoryChart = new Chart(
              categoryChartContainer.value,
              chartData as any
            );
          }
        }
      });

      for (const item of statistic.value.statisticCategories) {
        const record = categoryStatistics.value.find(
          (s) => s.name === item.categoryName
        );
        if (record) {
          record.statistics.push(item);
        } else {
          categoryStatistics.value.push({
            name: item.categoryName,
            statistics: [item],
          });
        }
      }

      todayCategoryStatistics.value = categoryStatistics.value.map((cs) => {
        cs.statistics = cs.statistics.filter((s) => sameDate(s.recordDate));
        return cs;
      });

      // 默认第一个分区
      if (todayCategoryStatistics.value[0]?.statistics.length) {
        currentCategoryStatisticName.value =
          todayCategoryStatistics.value[0].name;
      }
    });
  });
});
</script>
<style scoped lang="less">
.statistic-items {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.statistic-todays {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  height: 200px;
}

@media screen and (max-width: 1000px) {
  .statistic-items {
    grid-template-columns: repeat(2, 1fr);
  }
  .statistic-todays {
    grid-template-columns: repeat(1, 1fr);
  }
}

@media screen and (max-width: 500px) {
  .statistic-items {
    grid-template-columns: repeat(1, 1fr);
  }
  .statistic-todays {
    grid-template-columns: repeat(1, 1fr);
  }
}

.statistic-item {
  padding: 12px;
  border-radius: 4px;
  background-color: white;
  box-shadow: 0px 0px 8px #c5c5c5;
}
</style>
