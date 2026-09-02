jest.mock("../db", () => ({
  query: jest.fn(),
}));

const request = require("supertest");
const pool = require("../db");
const app = require("../index");

describe("API tests", () => {
  beforeEach(() => {
    pool.query.mockReset();
  });

  test("GET /health should return status ok", async () => {
    const response = await request(app).get("/health");

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("ok");
    expect(response.body.version).toBe("1.0.0");
  });

  test("GET /api/computers should return computer list", async () => {
    pool.query.mockResolvedValue({
      rows: [
        {
          id: 1,
          asset_code: "PC001",
          brand_model: "Dell OptiPlex 7090",
          cpu: "Intel Core i5",
          ram_gb: 16,
          room: "Room 301",
          status: "available",
        },
      ],
    });

    const response = await request(app).get("/api/computers");

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].asset_code).toBe("PC001");
  });

  test("GET /api/computers/:id should return 404 when not found", async () => {
    pool.query.mockResolvedValue({
      rows: [],
    });

    const response = await request(app).get("/api/computers/999");

    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe("Computer not found");
  });
});