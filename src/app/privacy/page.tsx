export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">隐私政策</h1>
      <p className="mt-2 text-sm text-gray-500">最后更新：2024年12月</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-gray-700">
        <section>
          <h2 className="text-lg font-semibold text-gray-900">1. 信息收集</h2>
          <p className="mt-2">
            我们收集您主动提供的信息，包括：注册时提供的邮箱和姓名，
            以及您在使用过程中录入的学习记录、项目信息、竞赛证书等数据。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">2. 信息使用</h2>
          <p className="mt-2">
            您的数据仅用于提供成长记录和分析服务。AI 分析功能会调用您的数据
            生成周报、月报和简历润色，但不会将您的数据用于模型训练。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">3. 数据存储</h2>
          <p className="mt-2">
            您的数据存储在中国大陆地区的云服务器上。我们采用行业标准的加密
            措施保护您的数据安全。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">4. 数据控制</h2>
          <p className="mt-2">
            您对自己的数据拥有完全控制权。您可以随时导出、修改或删除您的所有数据。
            删除账号后，您的所有数据将被永久清除。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">5. AI 数据处理</h2>
          <p className="mt-2">
            当使用 AI 生成周报、月报或简历润色功能时，您的数据会被发送到
            OpenAI 或 DeepSeek 的 API 进行处理。我们不会将您的数据用于训练目的。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">6. 联系我们</h2>
          <p className="mt-2">
            如您对隐私政策有任何疑问，或希望删除账号，
            请通过应用内设置页面联系管理员。
          </p>
        </section>
      </div>
    </div>
  );
}
