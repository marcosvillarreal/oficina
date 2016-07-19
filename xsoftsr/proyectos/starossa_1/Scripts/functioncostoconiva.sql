USE [datos]
GO
/****** Object:  UserDefinedFunction [dbo].[f_costoconiva]    Script Date: 07/18/2008 06:31:32 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO




CREATE FUNCTION [dbo].[f_costoconiva] ( @costosiniva numeric(11,3),@tasaiva numeric(6,3),@interno numeric(11,3) )
RETURNS numeric(11,3)
AS
BEGIN
DECLARE @nnbase numeric(11,3)
DECLARE @costomasiva numeric(11,3)
select @nnbase = @costosiniva - @interno
SELECT @costomasiva = @nnbase * (1 + @tasaiva/100)
select @costomasiva = @costomasiva + @interno
RETURN @costomasiva
END
