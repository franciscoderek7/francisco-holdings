CREATE VIEW revenue_summary AS

SELECT

COUNT(*) AS payments,

SUM(amount) AS revenue

FROM payments;

